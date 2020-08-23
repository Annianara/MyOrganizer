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
  titles: Object[]
 //someshts: Project[][]  //попытка 1
  someshts: Project //попытка 2

  constructor(private databaseService: DatabaseService, private dateService: DateService) { }

  ngOnInit(): void  {

    this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadProjects2())
    ).subscribe(someshts => this.someshts = someshts )
console.log(this.someshts)


    // this.dateService.date.pipe(
    //   switchMap(value => this.databaseService.loadProjects(value))
    // ).subscribe(project => (this.projects = project
    // //  .sort((a, b) => {
    // //    if (a.date > b.date) return 1; else if (a.title < b.title) return -1; else return 0
    // //  }
    //  // )
    // ))

   this.dateService.date.pipe(
      switchMap(value => this.databaseService.loadPr())
    ).subscribe(title => this.titles = title )
      //  .sort((a, b) => {
      //    if (a.date > b.date) return 1; else if (a.title < b.title) return -1; else return 0
      //  }
      // )
  }

   // this.databaseService.loadProjects().subscribe(project=>(this.projects = project
     // .sort((a,b)=>{if (a.date> b.date) return 1; else if (a.date < b.date) return -1; else return 0 })))


  remove(project: Project) {
    this.databaseService.remove(project).subscribe(() => {
      this.projects = this.projects.filter(t => t.id !== project.id)
    }, err => console.error(err))
  }


}
