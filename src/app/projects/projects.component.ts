import {Component, Input, OnInit} from '@angular/core';
import {DatabaseService, Project, Thought} from "../shared/database.service";
import {switchMap} from "rxjs/operators";
import {DateService} from "../shared/date.service";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = []
  constructor(private databaseService: DatabaseService, private dateService: DateService) {}
  ngOnInit(): void  {
    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadProjects())
    ).subscribe(projects => this.projects = projects
      .sort((a, b) => {
        if (a.date > b.date) return 1; else if (a.title < b.title) return -1; else return 0
  }
  )
    )

    // this.dateService.date.pipe(
    //   switchMap(value => this.databaseService.loadProjects(value))
    // ).subscribe(project => (this.projects = project
    // //  .sort((a, b) => {
    // //    if (a.date > b.date) return 1; else if (a.title < b.title) return -1; else return 0
    // //  }
    //  // )
    // ))


  }

  remove(project: Project) {
    this.databaseService.remove(project).subscribe(() => {
      this.projects = this.projects.filter(t => t.id !== project.id)
    }, err => console.error(err))
  }


}
