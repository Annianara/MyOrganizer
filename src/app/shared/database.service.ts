import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map, reduce} from "rxjs/operators";
import * as moment from "moment";
import {Mood, Project, ProjectAction, ProjectsAll, Thought, MoodsCategories, ThoughtCategories} from "./intefaces";

export enum Types {
  thought,
  project,
  mood
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
  user = 'admin' //по идее, вместо переменной нужен сервис, который определяет юзера, в этой переменной мы должны получать ид пользователя

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

  load_this_day(date: moment.Moment, type: String): Observable<any[]> {
    return this.http
      .get<Object[]>(`${DatabaseService.url}${type}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(objects => {
        if (!objects) {
          return []
        }
        return Object.keys(objects).map(key => ({...objects[key], id: key}))
      }))
  }

  load_user_preferences(date: moment.Moment, type: String):Observable<ThoughtCategories[]>
  {
    return this.http
      .get<ThoughtCategories[]>(`${DatabaseService.url}users/${this.user}/user_preferences/categories_of_thoughts.json`)
      .pipe(map(objects => {
        if (!objects) {
          return []
        }
        return Object.keys(objects).map(key => ({...objects[key], id: key}))
      }))
  }
  createUserCategories(thoughtCategories: ThoughtCategories){
    return this.http
      .post(`${DatabaseService.url}users/${this.user}/user_preferences/categories_of_thoughts.json`, thoughtCategories)
       .pipe(map(res => {
         return {...thoughtCategories}

       }))

  }

/*  createUserCategories(thoughtCategories: ThoughtCategories){
    return this.http
      .post(`${DatabaseService.url}users/${this.user}/user_preferences/categories_of_thoughts`, thoughtCategories)
      .pipe(map(res => {
        return {...thoughtCategories}
  }))
  }*/
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
/*
  create(object: Object, types: string): Observable<ProjectAction> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.url}${types}/${object.date}.json`, object)
      .pipe(map(res => {
        return {...project, id: res.name}
      }))
  }
*/
  createM(mood: Mood, type: Types): Observable<Mood> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.url}${type}/${mood.date}.json`, mood)
      .pipe(map(res => {
        return {...mood, id: res.name}
      }))
  }

  remove(object: Thought|ProjectAction|Mood, type: String): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.url}${type}/${object.date}/${object.id}.json`)
  }

}
