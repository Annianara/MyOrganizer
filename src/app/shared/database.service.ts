import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map, reduce} from "rxjs/operators";
import * as moment from "moment";
import {Mood, Project, ProjectAction, ProjectsAll, Thought, Moods} from "./intefaces";


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

  actionArr(projects: ProjectsAll[], one_project: ProjectAction) {
    let index_first = projects.map(p => p.project.title).indexOf(one_project.title)
    if (index_first==-1)
    {
      projects.push({
        project:{
          title:one_project.title,
          category:one_project.category,
          date_begin:one_project.date,
          total_time:one_project.time
        },
        projectAction: [{
          title: one_project.title,
          category: one_project.category,
          action: one_project.action,
          date: one_project.date,
          short_description: one_project.short_description,
          time: one_project.time
        }]
      })
    }
    else
    {
      if (one_project.date < projects[index_first].project.date_begin)
      {
        projects[index_first].project.date_begin=one_project.date
      }
      projects[index_first].projectAction.push(one_project)
      if(one_project.time) {
        projects[index_first].project.total_time += one_project.time
      }
    }

    return projects
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
              projects = this.actionArr(projects, one_project)
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
        return Object.keys(projects).map(key => ({...projects[key], id: key}))
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
