import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{//, OnDestroy{
  title = 'MyOrganizer';
  // isAuthenticated = false
  // private userSub: Subscription

  constructor() {
  }

  ngOnInit(): void {
    // this.auth.user.subscribe(user=>{
    //     this.isAuthenticated = !!user
    // })
              }

  // ngOnDestroy(): void {
  //   this.userSub.unsubscribe()
  // }
}
