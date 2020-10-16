import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Mood, ProjectAction, Thought} from "../../../shared/intefaces";
import {CATEGORIES_MOODS} from "../../../shared/select_options";
import {switchMap} from "rxjs/operators";
import {DateService} from "../../../shared/date.service";
//import {DatabaseService, Types} from "../../shared/database.service";
import {DatabaseService} from "../../../shared/database_authentication.servise"


@Component({
  selector: 'app-mood',
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.scss', '../content.scss']
})
export class MoodComponent implements OnInit {
  formMoods: FormGroup
  moods: Mood[] = []
  selected = 'Отличное'
  categories_moods = CATEGORIES_MOODS

  constructor(public dateService: DateService,
              private databaseService: DatabaseService) { }

  ngOnInit(): void {
//    this.selected = 'Отличное'
    let types = ['thoughts', 'projects', 'moods']
    for (let type of types) {
      let obs = this.dateService.date.pipe(
        switchMap(value => this.databaseService.load_this_day(value, 'moods')
        ))
          obs.subscribe(moods => {this.moods = moods})
      }

    this.formMoods = new FormGroup({cur_mood: new FormControl('', Validators.required),
      reason: new FormControl(''), what_to_do: new FormControl(''),})

  }

  submit_M() {
    const {cur_mood, reason, what_to_do} = this.formMoods.value
    const mood: Mood = {
      cur_mood,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      reason,
      what_to_do
    }

    // this.databaseService.createM(mood, Types.mood).subscribe(mood => {
    //   this.moods.push(mood)
    //   this.formMoods.reset()
    // }, err => console.error(err))
    this.databaseService.create(mood, 'moods').subscribe(mood => {
      this.moods.push(<Mood>mood)
      this.formMoods.reset()
    }, err => console.error(err))

  }

  remove(object: ProjectAction | Thought | Mood, type: String) {
    this.databaseService.remove(object, type).subscribe(() => {
      this.moods = this.moods.filter((t => t.id !== object.id))
    }, err => console.error(err))
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
