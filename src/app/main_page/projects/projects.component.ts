import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Mood, ProjectAction, ProjectCategories, Thought} from "../../shared/intefaces";
import {Observable} from "rxjs";
import {CATEGORIES_PROJECTS} from "../../shared/select_options";
import {map, startWith, switchMap} from "rxjs/operators";
import {DateService} from "../../shared/date.service";
import {DatabaseService} from "../../shared/database.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {


  myControl_c = new FormControl();

  formProjects: FormGroup
  projects: ProjectAction[] = []
  filteredCategories: Observable<ProjectCategories[]>;
  categories_projects = CATEGORIES_PROJECTS

  private _filter(name: string, p): [] {
    const filterValue = name.toLowerCase();
    if ('p_category' in p[0])
      return p.filter(option => option.p_category.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(public dateService: DateService,
              private databaseService: DatabaseService) { }

  ngOnInit(): void {

      let obs = this.dateService.date.pipe(
        switchMap(value => this.databaseService.load_this_day(value, 'projects')
        ))
          obs.subscribe(projects => { this.projects = projects})

    this.formProjects = new FormGroup({title: new FormControl('', Validators.required),
                                               category: new FormControl('',Validators.required),
                                               action: new FormControl('', Validators.required),})

    this.filteredCategories = this.myControl_c.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.categories_projects) : this.categories_projects.slice())
      );

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
      this.formProjects.reset()
    }, err => console.error(err))

  }
  remove(object: ProjectAction | Thought | Mood, type: String) {
    this.databaseService.remove(object, type).subscribe(() => {
          this.projects = this.projects.filter(t => t.id !== object.id)
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
