import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Mood, ProjectAction, ProjectCategories, Thought} from "../../../shared/intefaces";
import {Observable} from "rxjs";
import {CATEGORIES_PROJECTS} from "../../../shared/select_options";
import {map, startWith, switchMap} from "rxjs/operators";
import {DateService} from "../../../shared/date.service";
//import {DatabaseService} from "../../shared/database.service";
import {DatabaseService} from "../../../shared/database_authentication.servise"
import {AddUserCategoriesComponent} from "../../../add-user-categories/add-user-categories.component";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss', '../blocks.scss']
})
export class ProjectsComponent implements OnInit {


  // myControl_c = new FormControl();

  formProjects: FormGroup
  projects: ProjectAction[] = []
  filteredCategories: Observable<ProjectCategories[]>;
  categories_default = CATEGORIES_PROJECTS
  userPreferences: ProjectCategories[] = []
  categories_all: ProjectCategories[]= CATEGORIES_PROJECTS
  is_clicked = false


  @ViewChild(AddUserCategoriesComponent, {static: false})
  private addUserCategoriesComponent: AddUserCategoriesComponent;

  clicked()
  {
    this.is_clicked=!this.is_clicked
  }

  private _filter(name: string, p): [] {
    const filterValue = name.toLowerCase();
    if ('category' in p[0])
      return p.filter(option => option.category.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(public dateService: DateService,
              private databaseService: DatabaseService) { }

  ngOnInit(): void {

      let obs = this.dateService.date.pipe(
        switchMap(value => this.databaseService.load_this_day(value, 'projects')
        ))
          obs.subscribe(projects => { this.projects = projects})


  this.databaseService.load_user_categories('projects')
    .subscribe(preferences => {
      this.userPreferences = preferences
      console.log("preferences"+preferences)
      // this.categories_all = [ ...this.categories_default, ...this.userPreferences]

      this.filteredCategories = this.formProjects.get('category').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name, this.categories_all) : this.categories_all.slice())
        );
    })

      this.formProjects = new FormGroup({category: new FormControl('', Validators.required),
                                               title: new FormControl('',Validators.required),
                                               action: new FormControl('', Validators.required),})
  }

  submit() {

    const  {title, action, category} = this.formProjects.value
    let index_first = this.categories_all.map(p => p.category).indexOf(category)
    if (index_first==-1)
    // if (!this.categories_default.includes(category))
    {
      this.addUserCategoriesComponent.isVisible=true
      this.addUserCategoriesComponent.category = category
      this.addUserCategoriesComponent.type = 'projects'
      this.addUserCategoriesComponent.added_category.subscribe(user_preference=> {this.userPreferences.push(user_preference)
        this.categories_all.push(user_preference)}
      )
      // this.addUserCategoriesComponent.add_category('projects', category).subscribe
      // (user_preference=> this.userPreferences.push(user_preference))

    }
    const project: ProjectAction = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
      category,
      action
    }

  //  this.databaseService.createP(project).subscribe(project => {
      this.databaseService.create(project, 'projects').subscribe( project => {
      this.projects.push(<ProjectAction>project)
      this.formProjects.reset()
    }, err => console.error(err))

    this.clicked()
  }
  remove(object: ProjectAction | Thought | Mood, type: String) {
    this.databaseService.remove(object, type).subscribe(() => {
          this.projects = this.projects.filter(t => t.id !== object.id)
    }, err => console.error(err))
  }

  // displayFn(p): string {
  //   if (p) {
  //     return p
  //     /*      if ('p_category' in p)
  //           return  p.p_category
  //           if ('t_category' in p)
  //           return   p.t_category*/
  //   } else return ''
  // }

}
