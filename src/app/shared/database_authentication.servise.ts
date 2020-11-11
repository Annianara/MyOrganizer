import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import * as moment from "moment";
import {
  Mood,
  ProjectAction,
  ProjectsAll,
  Thought
} from "./intefaces";
import {environment} from "../../environments/environment";
import {AuthService} from "../auth/auth.service";


interface CreateResponse {
  name: string
  category: string
  o_thought: string
}


@Injectable({providedIn: 'root'})
export class DatabaseService {
  static url = 'https://myorganizer-e93d5.firebaseio.com/'
   userid
  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.user.subscribe(us=> {
      this.userid = us.id
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

  load_all_projects(): Observable<ProjectsAll[]> {
    let projects: ProjectsAll[] = []
    return this.http
      .get<ProjectsAll[]>(`${DatabaseService.url}/projects/${this.userid}.json`)
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
      .get<Object[]>(`${DatabaseService.url}${type}/${this.userid}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(objects => {
        if (!objects) {
          return []
        }
        return Object.keys(objects).map(key => ({...objects[key], id: key}))
      }))
  }

  load_user_categories(type: String):Observable<any[]>
  {
    return this.http
      .get<Object[]>(`${environment.fbDbUrl}user_preferences/${this.userid}/${type}.json`)
      .pipe(map(objects => {
        if (!objects) {
          return []
        }
        return Object.keys(objects).map(key => ({...objects[key], id: key}))
      }))
  }
  create_user_categories(type:string, user_preferences:{category:string}):Observable<Object>
  {
    return this.http
      .post(`${environment.fbDbUrl}user_preferences/${this.userid}/${type}.json`, user_preferences)
      .pipe(map(() => {
        return {...user_preferences}

      }))

  }
  create(object: Thought|ProjectAction|Mood, types: string): Observable<Object> {
    return this.http
      .post<CreateResponse>(`${environment.fbDbUrl}${types}/${this.userid}/${object.date}.json`, object)
      .pipe(map(res => {
        return {...object, id: res.name}
      }))
  }

  remove(object: Thought|ProjectAction|Mood, type: String): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.url}${type}/${this.userid}/${object.date}/${object.id}.json`)
  }

}
