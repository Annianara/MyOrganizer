import {Injectable} from '@angular/core';
import * as moment from 'moment'
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class DateService {
  public date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment())

  changeDay(dir: number) {
    const value = this.date.value.add(dir, 'day')
    this.date.next(value)
  }

  changeDate(date: moment.Moment) {
    const value = this.date.value.set({
      date: date.date(),
      month: date.month()
    })
    this.date.next(value)
  }

  changeDate2(date: Date)
  {
    const value = this.date.value.set({
      date: date.getDate(),
      month: date.getMonth()
    })
    this.date.next(value)

  }
}
