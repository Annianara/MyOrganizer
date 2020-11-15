import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {map, switchMap, take} from "rxjs/operators";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  email

  constructor(public auth: AuthService) { }

  ngOnInit(): void {

    if(this.auth.isAuthenticated())
    {
      this.auth.user.subscribe(us=>this.email=us.email)
      // this.email=localStorage.getItem('email')
    }
  }

  logout($event)
  {
    $event.preventDefault()
    this.auth.logout()
    // this.router.navigate(['login'])

  }
}
