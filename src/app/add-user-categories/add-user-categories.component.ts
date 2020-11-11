import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DatabaseService} from "../shared/database_authentication.servise";

@Component({
  selector: 'app-add-user-categories',
  templateUrl: './add-user-categories.component.html',
  styleUrls: ['./add-user-categories.component.scss']
})
export class AddUserCategoriesComponent implements OnInit {

  @Output()public getUserData = new EventEmitter<any>();

  isVisible = false

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

  add_category()
  {
    const new_category = {
      category: this._category
    }
    this.isVisible = false
   this.getUserData.emit(this.databaseService.create_user_categories(this._type, new_category))

  }

}
