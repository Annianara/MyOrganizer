import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DatabaseService, Mood, Project, ProjectAction, Thought, Types} from "../shared/database.service";
import {DateService} from "../shared/date.service";
import {switchMap} from "rxjs/operators";


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

  form: FormGroup
  thoughts: Thought[] = []

  formMoods: FormGroup
  moods: Mood[] = []

  formProjects: FormGroup
  projects: ProjectAction[] = []

  constructor(public dateService: DateService,
              private databaseService: DatabaseService) {
  }

  ngOnInit() {
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



    this.form = new FormGroup({
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

  submit_T() {
    const {title} = this.form.value
    const {category} = this.form.value
    const {o_thought} = this.form.value

    const thought: Thought = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      category,
      o_thought,
    }

    this.databaseService.createT(thought).subscribe(thought => {
      this.thoughts.push(thought)
      this.form.reset()
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
      this.form.reset()
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
      this.form.reset()
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
