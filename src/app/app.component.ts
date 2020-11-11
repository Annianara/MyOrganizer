import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'MyOrganizer';
  // isAuthenticated = false

  constructor() {
  }

  ngOnInit(): void {
    // this.auth.user.subscribe(user=>{
    //     this.isAuthenticated = !!user
    // })
              }

}
