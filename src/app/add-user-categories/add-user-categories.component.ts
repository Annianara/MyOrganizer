import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  @Output()public getUserData = new EventEmitter<any>();

  isVisible = false

  added_category:Observable<any>

  // thoughts: Thought[] = []

  private _type:string=''
  private _category:string=''

  // added_category

  added_projects = []
  added_project


  set type(type:string)
  {this._type=type}

  set category(category:string)
  {this._category=category}


  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
  }

  // add_category(callback)
  add_category()
    // :Observable<any>
  {
    const new_category = {
      category: this._category
    }
    this.isVisible = false
      // this.databaseService.create_user_categories(this._type, new_category).subscribe(user_preference=> {this.added_category.push(user_preference)
      //   }, err => console.error("Ошибка"+ err)
      // )
    // this.databaseService.create(this.added_project,this._type).subscribe(added_project=> {this.added_projects.push(added_project)
    //   console.log("проект в юз кат: "+ added_project)
    //     }, err => console.error("Ошибка"+ err)
    //   )
   // callback(
   this.getUserData.emit(this.databaseService.create_user_categories(this._type, new_category))
   // )

  }

}
