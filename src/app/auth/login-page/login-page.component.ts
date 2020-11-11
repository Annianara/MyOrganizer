import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthResponseData, AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string  = null

  form: FormGroup;
  submitted = false;

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [ Validators.email]),
      password: new FormControl(null, [Validators.minLength(6)]),
    })
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
    this.error = ""
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true

    const user = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }

    let authObs: Observable<AuthResponseData>

    this.isLoading = true

    if (this.isLoginMode) {
     authObs =  this.auth.login(user)
    } else {
      authObs =  this.auth.signUp(user)
      }


    authObs.subscribe(  res=> {
      console.log(res)
    this.isLoading = false
        this.router.navigate(['main_page'])
    this.submitted = false
  },
  errorMessage => {
  this.error = errorMessage
  this.isLoading = false
}), () => {
      this.submitted = false
    }

    this.form.reset()
  }

}
