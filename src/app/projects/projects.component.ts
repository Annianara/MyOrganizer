import {Component, Input, OnInit} from '@angular/core';
import {DatabaseService, Project, ProjectAction, Thought} from "../shared/database.service";
import {switchMap} from "rxjs/operators";
import {DateService} from "../shared/date.service";
import {map, reduce} from "rxjs/operators";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: ProjectAction[] = []
  projectNames: String[] = []
  distinctProjects: Project[]
  constructor(private databaseService: DatabaseService, private dateService: DateService) {}

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  ngOnInit(): void  {


    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadProjectsActions())
    ).subscribe(projects => this.projects = projects
      .sort((a, b) => {
         // if  (a.title < b.title)  return 1; else if (a.date > b.date)  return -1; else return 0
          if  (a.title > b.title)  return 1; else if (a.title < b.title)   return -1; else return 0
        }
      )
    )

/*    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadProjectsActions())
    ).subscribe(projects =>projects.map(p=>this.projectNames.push(p.title)))*/ //действует на данный момент, но выводит только название
/*
    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadProjectsActions()), map(p=>this.projectNames.push(p.title))
      ).subscribe(projects =>projects.map(p=>this.projectNames.push(p.title))) //map перед пайпом в сабскрайбе тоже не работает,
    // он даже с мапом почему-то считает p массивом
*/
/*      this.dateService.date.pipe(
          switchMap(value => this.databaseService.loadProjectsActions())
        ).subscribe(projects =>projects.map(p=>this.projectNames.push(p.title)),()=>console.log("err"),()=> this.projectNames = this.projectNames.filter(this.onlyUnique))
 //не работает в резалте*/
        // this.projectNames = this.projectNames.filter(this.onlyUnique)

        this.dateService.date.pipe(
          switchMap(value => this.databaseService.loadDistinctProjects())
        ).subscribe(distinctProjects => this.distinctProjects = distinctProjects
          .sort((a, b) => {
            // if  (a.title < b.title)  return 1; else if (a.date > b.date)  return -1; else return 0
            if  (a.title > b.title)  return 1; else if (a.title < b.title)   return -1; else return 0
            }
          )
        )


            //this.projectNames = this.projects.map(k =>k.title).filter(this.onlyUnique)


    // this.dateService.date.pipe(
    //   switchMap(value => this.databaseService.loadProjects(value))
    // ).subscribe(project => (this.projects = project
    // //  .sort((a, b) => {
    // //    if (a.date > b.date) return 1; else if (a.title < b.title) return -1; else return 0
    // //  }
    //  // )
    // ))
    this.projectNames = this.projects.map(k =>k.title)

  }

  remove(project: Project) {
    this.databaseService.remove(project).subscribe(() => {
      this.projects = this.projects.filter(t => t.id !== project.id)
    }, err => console.error(err))
  }


}
