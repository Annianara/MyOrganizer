import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService,
  private router: Router) { }

  ngOnInit(): void {
  }

  logout($event)
  {
    $event.preventDefault()
    this.auth.logout()
    this.router.navigate(['login'])

  }

}
