import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Mood, ProjectAction, Thought, ThoughtCategories} from "../../../shared/intefaces";
import {Observable} from "rxjs";
import {CATEGORIES_THOUGHTS} from "../../../shared/select_options";
import {map, startWith, switchMap} from "rxjs/operators";
import {DateService} from "../../../shared/date.service";
import {DatabaseService} from "../../../shared/database_authentication.servise"
import {AddUserCategoriesComponent} from "../../../add-user-categories/add-user-categories.component";

@Component({
  selector: 'app-thoughts',
  templateUrl: './thoughts.component.html',
  styleUrls: ['./thoughts.component.scss', '../blocks.scss']
})
export class ThoughtsComponent implements OnInit {
  formThoughts: FormGroup
  thoughts: Thought[] = []
  filteredThoughts: Observable<ThoughtCategories[]>;
  // myControl_t = new FormControl();
  categories_default = CATEGORIES_THOUGHTS
  user_preferences: ThoughtCategories[] = []
  categories_all: ThoughtCategories[] = CATEGORIES_THOUGHTS
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
        switchMap(value => this.databaseService.load_this_day(value, 'thoughts')
        ))
          obs.subscribe(thoughts => {this.thoughts = thoughts})


    // this.dateService.date.pipe(
    //   switchMap(value =>
        this.databaseService.load_user_categories('thoughts')
  // ))
  .subscribe(preferences => {
      this.user_preferences = preferences
      this.categories_all = [ ...this.categories_default, ...this.user_preferences]

      // this.filteredThoughts = this.myControl_t.valueChanges
      this.filteredThoughts = this.formThoughts.get('category').valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name, this.categories_all) : this.categories_all.slice())
        );
    })

    this.formThoughts = new FormGroup({title: new FormControl('', Validators.required),
                                              category: new FormControl('', Validators.required),
                                              thought: new FormControl('', Validators.required)})

  }
  submit() {
    const {title,category,thought} = this.formThoughts.value
    let index_first = this.categories_all.map(p => p.category).indexOf(category)
    if (index_first==-1)
      // if (!this.categories_default.includes(category))
    {
      this.addUserCategoriesComponent.isVisible=true
      this.addUserCategoriesComponent.category = category
      this.addUserCategoriesComponent.type = 'thoughts'
      
      // this.addUserCategoriesComponent.add_category('projects', category).subscribe
      // (user_preference=> this.userPreferences.push(user_preference))

    }
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

    this.clicked()
  }

  remove(object: ProjectAction | Thought | Mood, type: String) {
    this.databaseService.remove(object, type).subscribe(() => {
      this.thoughts = this.thoughts.filter(t => t.id !== object.id)
    }, err => console.error(err))
  }
  //
  // displayFn(p): string {
  //   if (p) {
  //     return p
  //     /*      if ('p_category' in p)
  //           return  p.p_category
  //           if ('t_category' in p)
  //           return   p.t_category*/
  //   } else return ''
  // }
  getUserData(value){
    value.subscribe((value)=>{this.categories_all.push(value)})
  }
}
