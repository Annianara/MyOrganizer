import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DatabaseService, Types} from "../shared/database.service";
import {DateService} from "../shared/date.service";
import {map, startWith, switchMap} from "rxjs/operators";
import {Mood, ProjectAction, Thought, MoodsCategories, ProjectCategories, ThoughtCategories} from "../shared/intefaces";
import {CATEGORIES_MOODS, CATEGORIES_PROJECTS, CATEGORIES_THOUGHTS} from "../shared/select_options"
import {MatDatepicker, MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";
import {Observable} from "rxjs";
import {AddTCategoryComponent} from "../add-t-category/add-t-category.component";


@Component({
  selector: 'app-header',
  templateUrl: './main_page.html',
  styleUrls: ['./main_page.component.scss']
})
export class Main_pageComponent implements OnInit {

  calendar(){
  }
  statistics() {
  }
  show_projects(){
   // this.databaseService.loadProjects();

  }

  formThoughts: FormGroup
  thoughts: Thought[] = []

  formMoods: FormGroup
  moods: Mood[] = []

  formProjects: FormGroup
  projects: ProjectAction[] = []


  filteredCategories: Observable<ProjectCategories[]>;
  filteredThoughts: Observable<ThoughtCategories[]>;
  myControl_c = new FormControl();
  myControl_t = new FormControl();

  selected = 'Отличное'

  categories_moods=CATEGORIES_MOODS
  categories_projects=CATEGORIES_PROJECTS
  categories_thoughts=CATEGORIES_THOUGHTS
  categories_thoughts_user:ThoughtCategories[] = []
  categories_thoughts_all:ThoughtCategories[] = CATEGORIES_THOUGHTS




  //isVisible = false
  //itCat = new AddTCategoryComponent


  // picker1: FormControl
 // picker2: FormControl
  select( day: MatDatepickerInputEvent<Date>) {
    this.dateService.changeDate2(day.value)
  }
/*
  add_t_category()
  {
 //   this.itCat. = !this.itCat
    this.itCat.isVisible=!this.itCat.isVisible
  }
*/

/*  private _filter(name: string): ProjectCategories[] {
    const filterValue = name.toLowerCase();
    return this.projectCategories.filter(option => option.p_category.toLowerCase().indexOf(filterValue) === 0);
  } */
  private _filter(name: string, p): []{
    const filterValue = name.toLowerCase();
    if('p_category' in p[0])
      return p.filter(option => option.p_category.toLowerCase().indexOf(filterValue) === 0);
    if ('t_category' in p[0] )
    return p.filter(option => option.t_category.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(public dateService: DateService,
              private databaseService: DatabaseService) {
  }

    ngOnInit() {
    this.selected = 'Отличное'
  //  this.allMoods = this.selectOptions.allMoods
    this.dateService.date.pipe(
      switchMap(value => this.databaseService.load_this_day(value, 'thoughts'))
    ).subscribe(thoughts => {
      this.thoughts = thoughts
    })

    this.dateService.date.pipe(
      switchMap(value => this.databaseService.load_this_day(value, 'projects'))
    ).subscribe(projects => {
      this.projects = projects
    })

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

    this.formThoughts = new FormGroup({
      title: new FormControl('', Validators.required),
      category: new FormControl('',Validators.required),
      o_thought: new FormControl('',Validators.required)
    })

    this.formMoods = new FormGroup({
      cur_mood: new FormControl('', Validators.required),
      reason: new FormControl(''),
      what_to_do: new FormControl(''),
    })

    this.formProjects = new FormGroup({
      title: new FormControl('', Validators.required),
      category: new FormControl(''),
      action: new FormControl('',Validators.required),
    })


      this.filteredCategories = this.myControl_c.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name, this.categories_projects) : this.categories_projects.slice())
        );

/*      this.filteredThoughts = this.myControl_t.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name, this.categories_thoughts_all) : this.categories_thoughts_all.slice())
        );*/
      /*    this.filteredThoughts = this.myControl_t.valueChanges
            .pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : value.name),
              map(name => name ? this._filter(name, this.categories_thoughts) : this.categories_thoughts.slice())
            );*/


      //let itCat = new AddTCategoryComponent

  }

  displayFn(p): string {
    if (p) {
      return p
/*      if ('p_category' in p)
      return  p.p_category
      if ('t_category' in p)
      return   p.t_category*/
    }
    else return ''
  }


  submit_T() {
    const {title} = this.formThoughts.value
    const {category} = this.formThoughts.value
    const {o_thought} = this.formThoughts.value

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
    const {cur_mood} = this.formMoods.value
    const {reason} = this.formMoods.value
    const {what_to_do} = this.formMoods.value

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
  submit_P()
  {
    const {title} = this.formProjects.value
    const {action} = this.formProjects.value
    const {category} = this.formProjects.value

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

  remove(object: ProjectAction|Thought|Mood, type: String) {
    this.databaseService.remove(object,type).subscribe(() => {
      switch(type)
      { case 'thought':
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
/*  remove2(object: ProjectAction|Thought|Mood, objArr) { //доделать (расписать определение типов, и на их основании определить аргумент, свитч должен быть один)
    let type
    switch (object){
      case (object instanceof ProjectAction):
      {
        type = 'thought'
      }
    }
    this.databaseService.remove(object).subscribe(() => {
      switch(type)
      { case 'thought':
          this.thoughts = this.thoughts.filter(t => t.id !== object.id)
          break;
        case 'project':
          this.projects = this.projects.filter(t => t.id !== object.id)
          break;
        case 'mood':
          this.moods = this.moods.filter((t => t.id !== object.id))
      }
    }, err => console.error(err))
  }*/


}
