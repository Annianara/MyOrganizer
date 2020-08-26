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
  total_time?: number
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


   onlyUniqueP(value, index, self:Project[]) {
  // return self.map(p=>p.title).indexOf(value.title)===index
    if (self.map(p=>p.title).indexOf(value.title)===index) {
       console.log(value.title)
       console.log(value + " под номером " + index + " уникально")
     }
     else console.log("Номер первого вхождения: "+ self.indexOf(value.title)  + ", индекс: " + index)
    return self.map(p=>p.title).indexOf(value.title)===index;
  } //попытка фильтровать сразу в проекте (неудачная)

   onlyUnique(value, index, self) {
     if(self.indexOf(value.title) === index) {
       console.log(value.title)
       console.log(value + " под номером " + index + " уникально")
     }
     else console.log("Номер первого вхождения: "+ self.indexOf(value.title)  + ", индекс: " + index)
    return self.indexOf(value) === index;
  }


/*
// usage example:
  var a = ['a', 1, 'a', 2, '1'];
  var unique = a.filter( onlyUnique ); // returns ['a', 1, 2, '1']
*!/
*/

  loadDistinctProjects():Observable<Project[]>{
    let projects:Project[] = []
    let projectsName:String[] = []
    return this.http
      .get<ProjectAction[][]>(`${DatabaseService.urlP}.json`)
      .pipe(map(all_projects => {
          if (!all_projects) {
            return []
          }

/*          for (let projects_one_day in Object.values(all_projects)) {
            for (let one_project of Object.values(all_projects[projects_one_day])) {
             // projects.push(one_project)
               projects.push({...one_project, date: Object.keys(projects_one_day)} )
            }
          } //не работает*/
          for (let projects_one_day of Object.values(all_projects)) {
            for (let one_project of Object.values(projects_one_day)) {
              projects.push({title:one_project.title, category:one_project.category})
              projectsName.push(one_project.title)

              // projectO.push({...kk, date: Object.keys(projects)} ) --выводит все даты, а не только эту
            }
          }
          console.log(projects)
    //    projectsName = projectsName.filter(this.onlyUnique)
       return projects.filter(this.onlyUniqueP)

  /*         return projects*/

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
              // projectO.push({...kk, date: Object.keys(projects)} ) --выводит все даты, а не только эту
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
        //  return Object.keys(projects).map(key => ({...projects[key], id: key}))
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
