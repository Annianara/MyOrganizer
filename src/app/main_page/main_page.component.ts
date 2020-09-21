import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DatabaseService, Types} from "../shared/database.service";
import {DateService} from "../shared/date.service";
import {map, startWith, switchMap} from "rxjs/operators";
import {Mood, ProjectAction, Thought, MoodsCategories, ProjectCategories, ThoughtCategories} from "../shared/intefaces";
import {CATEGORIES_MOODS, CATEGORIES_PROJECTS, CATEGORIES_THOUGHTS} from "../shared/select_options"
import {MatDatepicker, MatDatepickerInputEvent} from "@angular/material/datepicker";
import {Observable} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './main_page.html',
  styleUrls: ['./main_page.component.scss']
})
export class Main_pageComponent implements OnInit {



  select(day: MatDatepickerInputEvent<Date>) {
    this.dateService.changeDate2(day.value)
  }

  constructor(public dateService: DateService,
              private databaseService: DatabaseService) {
  }

  ngOnInit() {

  }

  displayFn(p): string {
    if (p) {
      return p
      /*      if ('p_category' in p)
            return  p.p_category
            if ('t_category' in p)
            return   p.t_category*/
    } else return ''
  }









}
