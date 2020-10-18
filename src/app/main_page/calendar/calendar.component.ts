import { Component, OnInit } from '@angular/core';
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {DateService} from "../../shared/date.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  constructor(public dateService: DateService) { }

  ngOnInit(): void {
  }

  select(day: MatDatepickerInputEvent<Date>) {
    this.dateService.changeDate2(day.value)
  }

}
