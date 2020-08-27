import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map, reduce} from "rxjs/operators";
import * as moment from "moment";


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

export interface Thought {
  id?: string
  title: string
  date?: string
  category?: string
  o_thought?: string
}

export interface Project {
  id?:string
  title:string
  category?:string
  date_begin?:string
  total_time?:number
}
export interface ProjectAction {
  id?: string
  title: string
  date?: string
  category?: string
  action: string
  short_description?: string
  time?: number
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

   onlyUnique(value, index, self:Project[]) {

     if(self.map(p=>p.title).indexOf(value.title)===index) {
       console.log(value.title)
       console.log(" под номером " + index + " уникально")
     }
     else console.log("Номер первого вхождения: "+self.map(p=>p.title).indexOf(value.title)  + ", индекс: " + index)
    return self.map(p=>p.title).indexOf(value.title)===index;
  }

  calcSum():Observable<Project[]>
    {
      let projects:Project[] = []
      return this.http
        .get<ProjectAction[][]>(`${DatabaseService.urlP}.json`)
        .pipe(map(all_projects => {
            if (!all_projects) {
              return []
            }

            for (let projects_one_day of Object.values(all_projects)) {
              for (let one_project of Object.values(projects_one_day)) {
                projects.push({title:one_project.title, category:one_project.category, date_begin:one_project.date})
              }
            }
            return projects.filter(this.onlyUnique)
            //   projects = projects.filter(this.onlyUnique)
            /*        for (let p in projects)
                    {

                    }*/
          }
          )
        )

    }

  loadDistinctProjects():Observable<Project[]>{
    let projects:Project[] = []
    return this.http
      .get<ProjectAction[][]>(`${DatabaseService.urlP}.json`)
      .pipe(map(all_projects => {
          if (!all_projects) {
            return []
          }

          for (let projects_one_day of Object.values(all_projects)) {
            for (let one_project of Object.values(projects_one_day)) {
              projects.push({title:one_project.title, category:one_project.category, date_begin:one_project.date})
            }
          }
       return projects.filter(this.onlyUnique)
     //   projects = projects.filter(this.onlyUnique)
/*        for (let p in projects)
        {

        }*/
        }
        )
      )

  }
  loadProjectsActions(): Observable<ProjectAction[]> {
    let projects:ProjectAction[] = []
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
