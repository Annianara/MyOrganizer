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


  formThoughts: FormGroup
  thoughts: Thought[] = []

  formMoods: FormGroup
  moods: Mood[] = []

  formProjects: FormGroup
  projects: ProjectAction[] = []
  projects2: ProjectAction[] = []


  filteredCategories: Observable<ProjectCategories[]>;
  filteredThoughts: Observable<ThoughtCategories[]>;
  myControl_c = new FormControl();
  myControl_t = new FormControl();

  selected = 'Отличное'

  categories_moods = CATEGORIES_MOODS
  categories_projects = CATEGORIES_PROJECTS
  categories_thoughts = CATEGORIES_THOUGHTS
  categories_thoughts_user: ThoughtCategories[] = []
  categories_thoughts_all: ThoughtCategories[] = CATEGORIES_THOUGHTS


  select(day: MatDatepickerInputEvent<Date>) {
    this.dateService.changeDate2(day.value)
  }

  private _filter(name: string, p): [] {
    const filterValue = name.toLowerCase();
    if ('p_category' in p[0])
      return p.filter(option => option.p_category.toLowerCase().indexOf(filterValue) === 0);
    if ('t_category' in p[0])
      return p.filter(option => option.t_category.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(public dateService: DateService,
              private databaseService: DatabaseService) {
  }

  ngOnInit() {
    this.selected = 'Отличное'
    let types = ['thoughts', 'projects', 'moods']
    for (let type of types) {
      let obs = this.dateService.date.pipe(
        switchMap(value => this.databaseService.load_this_day(value, type)
        ))
      switch (type) {
        case 'thoughts': {
          obs.subscribe(thoughts => {this.thoughts = thoughts})
          break;
        }
        case 'projects': {
          obs.subscribe(projects => { this.projects = projects})
          break;
        }
        case 'moods': {
          obs.subscribe(moods => {this.moods = moods})
          break;
        }
      }
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

    this.formThoughts = new FormGroup({title: new FormControl('', Validators.required), category: new FormControl('', Validators.required), o_thought: new FormControl('', Validators.required)})
    this.formMoods = new FormGroup({cur_mood: new FormControl('', Validators.required), reason: new FormControl(''), what_to_do: new FormControl(''),})
    this.formProjects = new FormGroup({title: new FormControl('', Validators.required), category: new FormControl('',Validators.required), action: new FormControl('', Validators.required),})

    this.filteredCategories = this.myControl_c.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.categories_projects) : this.categories_projects.slice())
      );
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


  submit_T() {
    const {title,category,o_thought} = this.formThoughts.value
    const thought: Thought = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      category,
      o_thought,
    }

    this.databaseService.createT(thought).subscribe(thought => {
      this.thoughts.push(thought)
      this.formThoughts.reset()
    }, err => console.error(err))
  }

  submit_M() {
    const {cur_mood, reason, what_to_do} = this.formMoods.value
    const mood: Mood = {
      cur_mood,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      reason,
      what_to_do
    }

    this.databaseService.createM(mood, Types.mood).subscribe(mood => {
      this.moods.push(mood)
      this.formThoughts.reset()
    }, err => console.error(err))
  }

  submit_P() {
    const  {title, action, category} = this.formProjects.value
    const project: ProjectAction = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      category,
      action
    }

    this.databaseService.createP(project).subscribe(project => {
      this.projects.push(project)
      this.formThoughts.reset()
    }, err => console.error(err))

  }

  remove(object: ProjectAction | Thought | Mood, type: String) {
    this.databaseService.remove(object, type).subscribe(() => {
      switch (type) {
        case 'thought':
          this.thoughts = this.thoughts.filter(t => t.id !== object.id)
          break;
        case 'project':
          this.projects = this.projects.filter(t => t.id !== object.id)
          break;
        case 'mood':
          this.moods = this.moods.filter((t => t.id !== object.id))
      }
    }, err => console.error(err))
  }


}
