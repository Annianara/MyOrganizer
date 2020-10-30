import {Component, Input, OnInit} from '@angular/core';
import { FormGroup} from "@angular/forms";
import {Thought, ThoughtCategories} from "../shared/intefaces";
import {DatabaseService} from "../shared/database_authentication.servise";

import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-add-user-categories',
  templateUrl: './add-user-categories.component.html',
  styleUrls: ['./add-user-categories.component.scss']
})
export class AddUserCategoriesComponent implements OnInit {


  isVisible = false

  added_category

  // thoughts: Thought[] = []

  private _type:string=''
  private _category:string=''


  set type(type:string)
  {this._type=type}

  set category(category:string)
  {this._category=category}


  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
  }

  // add_category(type:string, category:string):Observable<any>
  add_category()
    // :Observable<any>
  {
    const new_category = {
      category: this._category
    }
    this.isVisible = false
     this.added_category= this.databaseService.create_user_categories(this._type, new_category)
  }

}
