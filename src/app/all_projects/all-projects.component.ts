import {Component, Input, OnInit} from '@angular/core';
import {DatabaseService} from "../shared/database.service";
import {switchMap} from "rxjs/operators";
import {DateService} from "../shared/date.service";
import {Project, ProjectAction, ProjectsAll} from "../shared/intefaces";

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss']
})
export class AllProjectsComponent implements OnInit {
  projects: ProjectAction[] = []
  allProjects: ProjectsAll[]
  public isCollapsed = []

  constructor(private databaseService: DatabaseService, private dateService: DateService) {
  }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadAllProjects())
    ).subscribe(allProjects => {
        this.allProjects = allProjects.sort((a, b) => {
            if (a.project.title > b.project.title) return 1; else if (a.project.title < b.project.title) return -1; else return 0
          }
        )
        for (let i = 0; i <= this.allProjects.length; i++)
          this.isCollapsed[i] = true
      }
    )

  }

}
