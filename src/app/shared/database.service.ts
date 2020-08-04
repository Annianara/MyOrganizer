import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

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

export interface Task {
  id?: string
  title: string
  date?: string
}

export interface Thought{
  id?: string
  title: string
  date?: string
  category?: string
  o_thought?: string
}

export interface Project{
  id?: string
  title: string
  date?: string
  category?: string
  action: string
}

export interface Mood {
  id?: string
  date?: string
  cur_mood: string
  reason?: string
  what_to_do?: string
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

  loadProjects(date: moment.Moment): Observable<Project[]>{
    return this.http
      .get<Project[]>(`${DatabaseService.urlP}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(projects => {
        if (!projects) {
          return []
        }
        return Object.keys(projects).map(key => ({...projects[key], id: key}))
      }
      ))

   // sort((a,b)=>{if (a.date> b.date) return 1 else if (a.date<b.date) return -1 else return 0 })
  }

  loadP(date: moment.Moment): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${DatabaseService.urlP}/${date.format('DD-MM-YYYY')}.json`)
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
  createP(project: Project): Observable<Project> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.urlP}/${project.date}.json`, project)
      .pipe(map(res => {
        return {...project, id: res.name}
      }))
  }
  create(mood: Mood, type: Types ): Observable<Mood> {
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
  removeP(project: Project): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.urlP}/${project.date}/${project.id}.json`)
  }
  remove(thought: Thought): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.urlT}/${thought.date}/${thought.id}.json`)
  }

}
