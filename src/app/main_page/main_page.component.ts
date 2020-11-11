import {Component, OnInit} from '@angular/core';
import {DateService} from "../shared/date.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'app-main_page',
  templateUrl: './main_page.html',
  styleUrls: ['./main_page.component.scss']
})
export class Main_pageComponent implements OnInit {

  select(day: MatDatepickerInputEvent<Date>) {
    this.dateService.changeDate(day.value)
  }

  constructor(public dateService: DateService)
  {}

  ngOnInit() {

  }

}
