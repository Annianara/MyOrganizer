import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Mood, MoodsCategories, ProjectAction, ProjectCategories, Thought} from "../../../shared/intefaces";
import {CATEGORIES_MOODS, CATEGORIES_PROJECTS} from "../../../shared/select_options";
import {map, startWith, switchMap} from "rxjs/operators";
import {DateService} from "../../../shared/date.service";
//import {DatabaseService, Types} from "../../shared/database.service";
import {DatabaseService} from "../../../shared/database_authentication.servise"
import {Observable} from "rxjs";


@Component({
  selector: 'app-mood',
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.scss', '../blocks.scss']
})
export class MoodComponent implements OnInit {
  formMoods: FormGroup
  filteredCategories: Observable<MoodsCategories[]>;


  moods: Mood[] = []
  selected = 'Отличное'
  categories_moods = CATEGORIES_MOODS
  is_clicked = false

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

    this.filteredCategories = this.formMoods.get('cur_mood').valueChanges
      // this.filteredCategories = this.myControl_c.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.categories_moods) : this.categories_moods.slice())
      );


  }

  click()
  {
    this.is_clicked=!this.is_clicked
  }

  private _filter(name: string, p): [] {
    const filterValue = name.toLowerCase();
    if ('mood' in p[0])
      return p.filter(option => option.mood.toLowerCase().indexOf(filterValue) === 0);
  }



  submit() {
    const {cur_mood, reason, what_to_do} = this.formMoods.value
    const mood: Mood = {
      cur_mood,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      reason,
      what_to_do
    }
    this.databaseService.create(mood, 'moods').subscribe(mood => {
      this.moods.push(<Mood>mood)
      this.formMoods.reset()
    }, err => console.error(err))

    this.click()
  }

  remove(object: ProjectAction | Thought | Mood, type: String) {
    this.databaseService.remove(object, type).subscribe(() => {
      this.moods = this.moods.filter((t => t.id !== object.id))
    }, err => console.error(err))
  }

}
