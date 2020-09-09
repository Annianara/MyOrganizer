import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Thought, ThoughtCategories} from "../shared/intefaces";
import {DatabaseService} from "../shared/database.service";

@Component({
  selector: 'app-add-t-category',
  templateUrl: './add-t-category.component.html',
  styleUrls: ['./add-t-category.component.scss']
})
export class AddTCategoryComponent implements OnInit {
  @Input() type
  isVisible = false

  form_cat_of_thoughts: FormGroup
  thoughts: Thought[] = []

  added_categories


  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    this.form_cat_of_thoughts = new FormGroup({
      new_cat: new FormControl('', Validators.required)
    })

  }

  add_t_category() {
    const {new_cat} = this.form_cat_of_thoughts.value
    const thoughtCategory: ThoughtCategories = {
      t_category: new_cat
    }
    added_categories = this.databaseService.createUserCategories(thoughtCategory)
    this.form_cat_of_thoughts.reset()
    this.isVisible = false
  }

}
