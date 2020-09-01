import {Component, Input, OnInit} from '@angular/core';
import {DatabaseService} from "../shared/database.service";
import {switchMap} from "rxjs/operators";
import {DateService} from "../shared/date.service";
import {Project, ProjectAction, ProjectsAll} from "../shared/intefaces";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: ProjectAction[] = []
  projectNames: String[] = []
  distinctProjects: Project[]
  allProjects: ProjectsAll[]
  public isCollapsed = true;
  public isCollapsed2 = true;
  public isCollapsed3 = []
  constructor(private databaseService: DatabaseService, private dateService: DateService) {}

  ngOnInit(): void  {
    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadAllProjects())
    ).subscribe(allProjects => {
        this.allProjects = allProjects.sort((a, b) => {
          // if  (a.title < b.title)  return 1; else if (a.date > b.date)  return -1; else return 0
          if  (a.titleProject > b.titleProject)  return 1; else if (a.titleProject < b.titleProject)   return -1; else return 0
        }
        )
          ;
          {for (let i = 0; i<=this.allProjects.length;i++)
            this.isCollapsed3[i]=true}
      }
/*
      )*/
    )


    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadProjectsActions())
    ).subscribe(projects => this.projects = projects
      .sort((a, b) => {
         // if  (a.title < b.title)  return 1; else if (a.date > b.date)  return -1; else return 0
          if  (a.title > b.title)  return 1; else if (a.title < b.title)   return -1; else return 0
        }
      )
    )

        this.dateService.date.pipe(
          switchMap(value => this.databaseService.loadDistinctProjects())
        ).subscribe(distinctProjects => {this.distinctProjects = distinctProjects
          .sort((a, b) => {
            if  (a.title > b.title)  return 1; else if (a.title < b.title)   return -1; else return 0
            }
          )
        }
        )


  }
/*
  for (let i = 0; i<=this.allProjects.length;i++)
    this.isCollapsed3[i]=true*/

  remove(project: Project) {
    this.databaseService.remove(project).subscribe(() => {
      this.projects = this.projects.filter(t => t.id !== project.id)
    }, err => console.error(err))
  }


}
