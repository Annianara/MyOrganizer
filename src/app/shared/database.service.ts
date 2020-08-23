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

export interface Thought{
  id?: string
  title: string
  date?: string
  category?: string
  o_thought?: string
}

export interface Projects{
  keyT:{
    id?: string
    title: string
    date?: string
    category?: string
    action: string
  }[]

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


 // loadProjects2(): Observable<Project[][]> {
/*        return this.http
          .get<Project[]>(`${DatabaseService.urlT}.json`)
          .pipe(map(projects => {
            if (!projects) {
              return []
            }
         //   console.log(projects)
         //  return Object.values(projects)
          //  return Object.values(projects).map(key => reduce(key.keyT)=>)
       //     return Object.values(projects).map(key => projects.reduce<Project[]>((acc, it) =>[...acc, key.keyT], []))
         //   return Object.values(projects).reduce<Project[]>((acc, it)=>[...acc,it => it.keyT],[])
         //   return  projects.reduce((acc, it) =>[...acc, it.title, it.id, it.date, it.category, it.action], [])

          }))*/

/*             return this.http
              .get<Project[]>(`${DatabaseService.urlT}.json`)
              .pipe(reduce((projects, project) => {
                if (!projects) {
                  return []
                }
             //   console.log(projects)
               projects.push(Object.values(projects))
               // return Object.values(projects).map(key => reduce(key.keyT)=>)
           //     return Object.values(projects).map(key => projects.reduce<Project[]>((acc, it) =>[...acc, key.keyT], []))
             //   return Object.values(projects).reduce<Project[]>((acc, it)=>[...acc,it => it.keyT],[])
             //   return  projects.reduce((acc, it) =>[...acc, it.title, it.id, it.date, it.category, it.action], [])

              },[]))*/

/////////////////////////----попытка, где считалось, что возвращается двумерный массив
/*       loadProjects2(): Observable<Project[][]> {
        return this.http
          // .get<Project[]>(`${DatabaseService.urlP}/${date.format('DD-MM-YYYY')}.json`)
          .get<Project[]>(`${DatabaseService.urlP}.json`)
          .pipe(map(projects => {
              if (!projects) {
                return []
              }
             Object.values(projects)*/

     loadProjects2(): Observable<Project[]> {
       let projectO = []


    //   let projectO: []
       let ii = 0
 return this.http
// .get<Project[]>(`${DatabaseService.urlP}/${date.format('DD-MM-YYYY')}.json`)
.get<Projects[]>(`${DatabaseService.urlP}.json`)
.pipe(map(projects => {
    if (!projects) {
      return []
    }
    ii++;
  for (let k of Object.values(projects)) {
            for (let kk of Object.values(k)) {
              console.log(kk)
              console.log("Класс"+ii)
           //   return (kk)
/*              let pp: Project = {
                title:'title',
                action: 'action'
              }
              projectO[0]=pp*/
              projectO.push(kk)
            }
             //   projectO.push(Object.values<Project>(k))
              }
  return projectO
  //  return projectO
}
  ///  return projectO

  )

)
     }

              //return Object.values(projects).map(key => key)
              //return Object.keys(projects).map(key => projects[key].map(k=>k.values()))
              // return Object.values(projects).map(key => key.title)
              //     return Object.keys(projects).map(key => ({...projects[key], id: key})).map(k=>Object.keys[k])
              //    return  projects.reduce((acc, it) =>[...acc, it.title, it.id, it.date, it.category, it.action], [])
              //  Object.keys(projects).map(key => {
              //      projects[key].map(k => {
              //       return Object.keys(k).map(kk => ({...k[kk], id: kk}))
              //      })
              //      }
              //   )

              //   return Object.keys(projects).map(key =>
              //       Object.keys.keys(projects[key]))
              //   .map(kk =>projects[key][kk])




  loadProjects(): Observable<Project[]> {
    let date = this.http
      .get<Project[]>(`${DatabaseService.urlP}.json`)
      .pipe(map(projects => Object.keys(projects)))
        console.log(date)
        let result
        for (let curD in date)
        {
          result.push(
            this.http
              .get<Project[]>(`${DatabaseService.urlT}/${curD}.json`)
              .pipe(map(projects => {
                if (!projects) {
                  return []
                }
                console.log(Object.keys(projects).map(key =>projects[key]))
                Object.keys(projects).map(key =>projects[key])
              }))
          )
        }
        return result;
/*    return this.http
      // .get<Project[]>(`${DatabaseService.urlP}/${date.format('DD-MM-YYYY')}.json`)
      .get<Project[]>(`${DatabaseService.urlP}.json`)
      .pipe(map(projects => {
          if (!projects) {
            return []
          }

          return Object.values(projects).map(key => key)
          //return Object.keys(projects).map(key => projects[key].map(k=>k.values()))
          //  return Object.values(projects).map(key => key.title)
          //     return Object.keys(projects).map(key => ({...projects[key], id: key})).map(k=>Object.keys[k])
          //    return  projects.reduce((acc, it) =>[...acc, it.title, it.id, it.date, it.category, it.action], [])
          //  Object.keys(projects).map(key => {
          //      projects[key].map(k => {
          //       return Object.keys(k).map(kk => ({...k[kk], id: kk}))
          //      })
          //      }
          //   )

          //   return Object.keys(projects).map(key =>
          //       Object.keys.keys(projects[key]))
          //   .map(kk =>projects[key][kk])

        }
        )
      )*/
  }

      //   return Object.keys(projects).map(key => ({...projects[key], id: key}))
    //    map(projects =>Object.keys(projects).map(key =>{...projects[key], id: key}))
      //k => return Object.keys(k).map(k => ({...projects[k], id: k})))))
      /*(map(projects => {
        if (!projects) {
          return []
        }
          return Object.keys(projects).map(key=>projects[key])
         //return Object.keys(projects).map(key => ({...projects[key], id: key}))
            //.map(k=>Object.keys[k])
         // return Object.keys(projects).map(key=>projects[key])
        //  return projects.reduce(function (a,b) {return[Object.keys(), Object.keys()]
        })
       // return Object.keys(projects).map(key => ({...projects[key], id: key}))
      )
    */

      /*(map(projects => {
          if (!projects) {
            return []
          }
          return Object.keys(projects).map(key=>projects[key])
          //return Object.keys(projects).map(key => ({...projects[key], id: key}))
          //.map(k=>Object.keys[k])
          // return Object.keys(projects).map(key=>projects[key])
          //  return projects.reduce(function (a,b) {return[Object.keys(), Object.keys()]
        })
        // return Object.keys(projects).map(key => ({...projects[key], id: key}))
      )
   // sort((a,b)=>{if (a.date> b.date) return 1 else if (a.date<b.date) return -1 else return 0 })
  }

/*-----------------------------------------------
  loadProjects(date: moment.Moment): Observable<any> {
    let observable = this.http
      .get<Project[]>(`${DatabaseService.urlP}.json`)
      .pipe(map(projects => {
        if (!projects) {
          return []
        }
        return Object.values(projects.values())}
      ));
  }
*/
  loadPr(): Observable<String[]> {
    return this.http
      .get<String[]>(`${DatabaseService.urlP}.json`)
      .pipe(map(projects => {
        if (!projects) {
          return []
        }
        return Object.keys(projects)
      }))
  }

  loadP(date: moment.Moment): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${DatabaseService.urlP}/${date.format('DD-MM-YYYY')}.json`)
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
