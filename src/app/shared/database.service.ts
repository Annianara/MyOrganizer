import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map, reduce} from "rxjs/operators";
import * as moment from "moment";
import {Mood, Project, ProjectAction, ProjectsAll, Thought} from "./intefaces";


export enum Types {
  thought,
  project,
  mood
}

export enum All_moods {
  'Отличное',
  'Хорошее',
  'Среднее',
  'Плохое',
  'Очень плохое'
}

interface CreateResponse {
  name: string
  category: string
  o_thought: string
}

interface CreateResponseMood {
  mood: string
  category: string
}

@Injectable({providedIn: 'root'})
export class DatabaseService {
  static url = 'https://myorganizerpb.firebaseio.com/'
  static urlT = 'https://myorganizerpb.firebaseio.com/thoughts'
  static urlP = 'https://myorganizerpb.firebaseio.com/projects'

  constructor(private http: HttpClient) {
  }

  onlyUnique(value, index, self: Project[]) {
    return self.map(p => p.title).indexOf(value.title) === index;
  }

  actionArr(self: ProjectsAll[]) {
    self.map((value, index, self) => {
        if (self.map(p => p.titleProject).indexOf(value.titleProject) != index) {
          self[self.map(p => p.titleProject).indexOf(value.titleProject)].project.push(value.project[0])
        }
      }
    )
    return self.filter((value, index, self) => self.map(p => p.titleProject).indexOf(value.titleProject) === index)
  }


  loadAllProjects(): Observable<ProjectsAll[]> {
    let projects: ProjectsAll[] = []
    return this.http
      .get<ProjectsAll[]>(`${DatabaseService.urlP}.json`)
      .pipe(map(all_projects => {
          if (!all_projects) {
            return []
          }

          for (let projects_one_day of Object.values(all_projects)) {
            for (let one_project of Object.values(projects_one_day)) {
              projects.push({
                titleProject: one_project.title, project: [{
                  title: one_project.title,
                  category: one_project.category,
                  action: one_project.action,
                  date: one_project.date,
                  short_description: one_project.short_description,
                  time: one_project.time
                }]
              })
            }
          }
          return this.actionArr(projects)
        }
        )
      )


  }

  calcSum(): Observable<Project[]> {
    let projects: Project[] = []
    return this.http
      .get<ProjectAction[][]>(`${DatabaseService.urlP}.json`)
      .pipe(map(all_projects => {
          if (!all_projects) {
            return []
          }

          for (let projects_one_day of Object.values(all_projects)) {
            for (let one_project of Object.values(projects_one_day)) {
              projects.push({title: one_project.title, category: one_project.category, date_begin: one_project.date})
            }
          }
          return projects.filter(this.onlyUnique)
        }
        )
      )

  }


  loadDistinctProjects(): Observable<Project[]> {
    let projects: Project[] = []
    return this.http
      .get<ProjectAction[][]>(`${DatabaseService.urlP}.json`)
      .pipe(map(all_projects => {
          if (!all_projects) {
            return []
          }

          for (let projects_one_day of Object.values(all_projects)) {
            for (let one_project of Object.values(projects_one_day)) {
              projects.push({title: one_project.title, category: one_project.category, date_begin: one_project.date})
            }
          }
          return projects.filter(this.onlyUnique)
        }
        )
      )

  }

  loadProjectsActions(): Observable<ProjectAction[]> {
    let projects: ProjectAction[] = []
    return this.http
      .get<ProjectAction[][]>(`${DatabaseService.urlP}.json`)
      .pipe(map(all_projects => {
          if (!all_projects) {
            return []
          }
          for (let projects_one_day of Object.values(all_projects)) {
            for (let one_project of Object.values(projects_one_day)) {
              projects.push(one_project)
            }
          }
          return projects
        }
        )
      )
  }


  loadP(date: moment.Moment): Observable<ProjectAction[]> {
    return this.http
      .get<ProjectAction[]>(`${DatabaseService.urlP}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(projects => {
        if (!projects) {
          return []
        }

        return Object.values(projects)
      }))
  }

  loadT(date: moment.Moment): Observable<Thought[]> {
    return this.http
      .get<Thought[]>(`${DatabaseService.urlT}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(thoughts => {
        if (!thoughts) {
          return []
        }
        return Object.keys(thoughts).map(key => ({...thoughts[key], id: key}))
      }))
  }

  load(date: moment.Moment, type: Types): Observable<Thought[]> {
    return this.http
      .get<Thought[]>(`${DatabaseService.urlT}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(thoughts => {
        if (!thoughts) {
          return []
        }
        return Object.keys(thoughts).map(key => ({...thoughts[key], id: key}))
      }))
  }

  createT(thought: Thought): Observable<Thought> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.urlP}/${thought.date}.json`, thought)
      .pipe(map(res => {
        return {...thought, id: res.name}
      }))
  }

  createP(project: ProjectAction): Observable<ProjectAction> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.urlP}/${project.date}.json`, project)
      .pipe(map(res => {
        return {...project, id: res.name}
      }))
  }

  create(mood: Mood, type: Types): Observable<Mood> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.urlT + type}/${mood.date}.json`, mood)
      .pipe(map(res => {
        return {...mood, id: res.name}
      }))
  }

  removeT(thought: Thought): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.urlT}/${thought.date}/${thought.id}.json`)
  }

  removeP(project: ProjectAction): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.urlP}/${project.date}/${project.id}.json`)
  }

  remove(thought: Thought): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.urlT}/${thought.date}/${thought.id}.json`)
  }

}
