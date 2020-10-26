import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Thought, ThoughtCategories} from "../shared/intefaces";
import {DatabaseService} from "../shared/database_authentication.servise";
import {DateService} from "../shared/date.service";
import {switchMap} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-add-user-categories',
  templateUrl: './add-user-categories.component.html',
  styleUrls: ['./add-user-categories.component.scss']
})
export class AddUserCategoriesComponent implements OnInit {

  @Input() type
  isVisible = false

  form_cat_of_thoughts: FormGroup
  thoughts: Thought[] = []

  added_categories

  addedthoughts


  constructor(private databaseService: DatabaseService, public dateService: DateService) {
  }

  ngOnInit(): void {
    this.form_cat_of_thoughts = new FormGroup({
      new_cat: new FormControl('', Validators.required)
    })

    /*
        this.dateService.date.pipe(
          switchMap(value => this.databaseService.load_this_day(value, 'all_projects'))
        ).subscribe(all_projects => {
          this.all_projects = all_projects.
        })
    */

  }

  add_t_category() {
    const {new_cat} = this.form_cat_of_thoughts.value
    const thoughtCategory: ThoughtCategories = {
      category: new_cat
    }
    // this.databaseService.createUserCategories(thoughtCategory).subscribe()
    this.form_cat_of_thoughts.reset()
    this.isVisible = false
  }

  add_category(type:string, category:string, m:string[]):Observable<any>
  {
    const thoughtCategory = {
      category: category
    }

    this.isVisible = false
     return  this.databaseService.createUserCategories(type, thoughtCategory)

      // m.push(s)

   // return m
  }

}
