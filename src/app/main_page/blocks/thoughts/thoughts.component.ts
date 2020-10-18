import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Mood, ProjectAction, Thought, ThoughtCategories} from "../../../shared/intefaces";
import {Observable} from "rxjs";
import {CATEGORIES_THOUGHTS} from "../../../shared/select_options";
import {map, startWith, switchMap} from "rxjs/operators";
import {DateService} from "../../../shared/date.service";
//import {DatabaseService} from "../../shared/database.service";
import {DatabaseService} from "../../../shared/database_authentication.servise"

@Component({
  selector: 'app-thoughts',
  templateUrl: './thoughts.component.html',
  styleUrls: ['./thoughts.component.scss', '../blocks.scss']
})
export class ThoughtsComponent implements OnInit {
  formThoughts: FormGroup
  thoughts: Thought[] = []
  filteredThoughts: Observable<ThoughtCategories[]>;
  myControl_t = new FormControl();
  categories_thoughts = CATEGORIES_THOUGHTS
  categories_thoughts_user: ThoughtCategories[] = []
  categories_thoughts_all: ThoughtCategories[] = CATEGORIES_THOUGHTS


  private _filter(name: string, p): [] {
    const filterValue = name.toLowerCase();
    if ('t_category' in p[0])
      return p.filter(option => option.t_category.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(public dateService: DateService,
              private databaseService: DatabaseService) { }

  ngOnInit(): void {
    let types = ['thoughts', 'projects', 'moods']
    for (let type of types) {
      let obs = this.dateService.date.pipe(
        switchMap(value => this.databaseService.load_this_day(value, 'thoughts')
        ))
          obs.subscribe(thoughts => {this.thoughts = thoughts})
    }

    this.dateService.date.pipe(
      switchMap(value => this.databaseService.load_user_preferences(value, 'thoughts'))
    ).subscribe(cat_thoughts_user => {
      this.categories_thoughts_user = cat_thoughts_user
      this.categories_thoughts_all = [...cat_thoughts_user, ...this.categories_thoughts]
      this.filteredThoughts = this.myControl_t.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name, this.categories_thoughts_all) : this.categories_thoughts_all.slice())
        );
    })

    this.formThoughts = new FormGroup({title: new FormControl('', Validators.required),
                                              category: new FormControl('', Validators.required),
                                              thought: new FormControl('', Validators.required)})

  }
  submit_T() {
    const {title,category,thought} = this.formThoughts.value
    const one_thought: Thought = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      category,
      thought
    }

  //  this.databaseService.createT(one_thought).subscribe(thought => {
    this.databaseService.create(one_thought, 'thoughts').subscribe(thought => {
      this.thoughts.push(<Thought>thought)
      this.formThoughts.reset()
    }, err => console.error(err))
  }

  remove(object: ProjectAction | Thought | Mood, type: String) {
    this.databaseService.remove(object, type).subscribe(() => {
      this.thoughts = this.thoughts.filter(t => t.id !== object.id)
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
