import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DatabaseService} from "../shared/database_authentication.servise";
import {switchMap, take} from "rxjs/operators";
import {DateService} from "../shared/date.service";
import {Project, ProjectAction, ProjectsAll} from "../shared/intefaces";
import {AuthService} from "../auth/auth.service";

// import {trigger, state, style, transition,} from
import {trigger, state, style, transition, animate, keyframes} from "@angular/animations";


@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
  animations:[
    trigger('myfirstanimation',[
      state('small', style({height:'0px'})),
      state('large',style({height:'100px'})),
      state('expanded',style({height:'*'})),

      // transition('small<=>large', animate('400ms ease-in'))
      // transition(':small', animate('400ms ease-in'))
      transition('small<=>expanded', animate('400ms ease-in'))
    ])
  ]
})
export class AllProjectsComponent implements OnInit {
  projects: ProjectAction[] = []
  allProjects: ProjectsAll[]
  public isCollapsed = []

  state:string[] = []

  @ViewChildren('inner_tables') inner_tables:QueryList<ElementRef>
  m_heights:number[]=[]


  animateMe(i)
  {
    this.state[i] = (this.state[i] === 'small'? 'large': 'small')
  }
  animateMe3(i)
  {
    this.state[i] = (this.state[i] === 'small'? 'expanded': 'small')
  }
  animateMe2(i)
  {
    this.state[i] = (this.state[i] === 'small'? 'large': 'small')
  }

  constructor(private databaseService: DatabaseService, private dateService: DateService, private auth:AuthService) {
  }

  ngOnInit(): void {
    this.auth.user.pipe(take(1),
      switchMap(()=> this.databaseService.load_all_projects()
      )).subscribe(allProjects => {
        this.allProjects = allProjects.sort((a, b) => {
            if (a.project.title > b.project.title) return 1; else if (a.project.title < b.project.title) return -1; else return 0
          }
        )
        for (let i = 0; i <= this.allProjects.length; i++) {
          // this.isCollapsed[i] = true
          this.state[i] = 'small'
          // string = 'small'
         // this.m_heights[i] =  this.inner_tables.[i].nativeElement.offsetHeight
        }
      // this.inner_tables.forEach((child) => { child.nativeElement.offsetHeight })
      }
    )
  }

}
