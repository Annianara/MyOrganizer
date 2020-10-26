import {Injectable, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map, reduce} from "rxjs/operators";
import * as moment from "moment";
import {
  Mood,
  Project,
  ProjectAction,
  ProjectsAll,
  Thought,
  MoodsCategories,
  ThoughtCategories,
  Data, ProjectCategories
} from "./intefaces";
import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";

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
  static url = 'https://myorganizer-e93d5.firebaseio.com/'

/*  static urlP = 'https://myorganizerpb.firebaseio.com/projects'*/
    user
  constructor(private http: HttpClient, private auth: AuthService) {
    // this.user = localStorage.getItem('uid') //по идее, вместо переменной нужен сервис, который определяет юзера, в этой переменной мы должны получать ид пользователя
    this.auth.user.subscribe(us=> {
      this.user = us.id
      // console.log("us id:"+ us.id)}
    })
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
    // let user
    // this.auth.user.subscribe(cur_user =>user = cur_user)
    // console.log("usl:" + this.user)
    return this.http
      .get<ProjectsAll[]>(`${DatabaseService.url}/projects/${this.user}.json`)
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
      .get<Object[]>(`${DatabaseService.url}${type}/${this.user}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(objects => {
        if (!objects) {
          return []
        }
        return Object.keys(objects).map(key => ({...objects[key], id: key}))
      }))
  }

  load_user_preferences( type: String):Observable<any[]>
  {
    return this.http
      .get<Object[]>(`${DatabaseService.url}/${type}/${this.user}/user_preferences.json`)
      .pipe(map(objects => {
        if (!objects) {
          return []
        }
        return Object.keys(objects).map(key => ({...objects[key], id: key}))
      }))
  }
  createUserCategories(type:string, user_preferences: ThoughtCategories|ProjectCategories|MoodsCategories):Observable<any>
  {
    return this.http
      .post(`${DatabaseService.url}/${type}/${this.user}/user_preferences.json`, user_preferences)
      .pipe(map(res => {
        return {...user_preferences}

      }))

  }

  /*  createUserCategories(thoughtCategories: ThoughtCategories){
      return this.http
        .post(`${DatabaseService.url}users/${this.user}/user_preferences/categories_of_thoughts`, thoughtCategories)
        .pipe(map(res => {
          return {...thoughtCategories}
    }))
    }*/
/*
  createT(thought: Thought): Observable<Thought> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.urlP}/${thought.date}.json`, thought)
      .pipe(map(res => {
        return {...thought, id: res.name}
      }))
  }
*/

/*  createP(project: ProjectAction): Observable<ProjectAction> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.url}/projects/${project.date}.json`, project)
      .pipe(map(res => {
        return {...project, id: res.name}
      }))
  }*/
    create(object: Thought|ProjectAction|Mood, types: string): Observable<Object> {
      return this.http
        .post<CreateResponse>(`${environment.fbDbUrl}${types}/${this.user}/${object.date}.json`, object)
        .pipe(map(res => {
          return {...object, id: res.name}
        }))
    }

/*  createM(mood: Mood, type: Types): Observable<Mood> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.url}${type}/${mood.date}.json`, mood)
      .pipe(map(res => {
        return {...mood, id: res.name}
      }))
  }*/

  remove(object: Thought|ProjectAction|Mood, type: String): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.url}${type}/${this.user}/${object.date}/${object.id}.json`)
  }

}
