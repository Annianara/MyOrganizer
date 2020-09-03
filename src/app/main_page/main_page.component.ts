import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DatabaseService, Types} from "../shared/database.service";
import {DateService} from "../shared/date.service";
import {map, startWith, switchMap} from "rxjs/operators";
import {Mood, ProjectAction, Thought, Moods, ProjectCategories, ThoughtCategories} from "../shared/intefaces";
import {Select_options} from "../shared/select_options"
import {MatDatepicker, MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from "moment";
import {Observable} from "rxjs";


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


  allMoods: Moods[] =
    [{mood: 'Отличное'},
      {mood: 'Хорошее'},
      {mood: 'Среднее'},
      {mood: 'Плохое'},
      {mood: 'Очень плохое'}]

  projectCategories: ProjectCategories[] =
    [
      { p_category: 'Спорт'},
      { p_category: 'Здоровье'},
      { p_category: 'Хобби'},
      { p_category: 'Работа'},
      { p_category: 'Учеба'},
      { p_category: 'Личная жизнь'},
      { p_category: 'Психология'},
      { p_category: 'Саморазвитие'},
      { p_category: 'Семья'},
      { p_category: 'Развлечение'},
      { p_category: 'Отдых'},
      { p_category: 'Книги'},
      { p_category: 'Кино'},
      { p_category: 'Музыка'},
      { p_category: 'Дом'},
      { p_category: 'Уход за собой'},
      { p_category: 'Саморазвитие'},
      { p_category: 'Изучение иностранных языков'},
      { p_category: 'Кулинария'},
      { p_category: 'Рисование'},
      { p_category: 'Игры'},
      { p_category: 'Шоппинг'},
      { p_category: 'Путешествия'},
      { p_category: 'Друзья'},
      { p_category: 'Правильное питание'},
      { p_category: 'Посещение интересных мест'},
      { p_category: 'Развитие интеллектуальных способностей'},
      { p_category: 'Фотографии'},
    ]

  thoughtCategories: ThoughtCategories[]=[
    {t_category:'Философия'},
    {t_category:'Психология'},
    {t_category:'Отношения'},
    {t_category:'Сны'},
    {t_category:'Мнения о фильмах'},
    {t_category:'Мнения о книгах'},
    {t_category:'Саморазвитие'}
  ]

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



  // picker1: FormControl
 // picker2: FormControl
  select( day: MatDatepickerInputEvent<Date>) {
    this.dateService.changeDate2(day.value)
  }

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
    this.filteredCategories = this.myControl_c.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.projectCategories) : this.projectCategories.slice())
      );

    this.filteredThoughts = this.myControl_t.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.thoughtCategories) : this.thoughtCategories.slice())
      );

  //  this.allMoods = this.selectOptions.allMoods
    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadT(value))
    ).subscribe(thoughts => {
      this.thoughts = thoughts
    })

    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadP(value))
    ).subscribe(projects => {
      this.projects = projects
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

  }

  displayFn(p): string {
    if (p) {
      if ('p_category' in p)
      return  p.p_category
      if ('t_category' in p)
      return   p.t_category
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

    this.databaseService.create(mood, Types.mood).subscribe(mood => {
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

  remove_T(thought: Thought) {
    this.databaseService.removeT(thought).subscribe(() => {
      this.thoughts = this.thoughts.filter(t => t.id !== thought.id)
    }, err => console.error(err))
  }
 remove_P(project: ProjectAction) {
    this.databaseService.removeP(project).subscribe(() => {
      this.projects = this.projects.filter(t => t.id !== project.id)
    }, err => console.error(err))
  }


}
