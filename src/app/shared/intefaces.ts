import {Observable} from "rxjs";

export interface Mood {
  id?: string
  date?: string
  cur_mood: string
  reason?: string
  what_to_do?: string
  completed?: boolean
}


export interface Thought {
  id?: string
  title: string
  date?: string
  category?: string
  thought?: string
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
export interface ProjectsAll{
  project: Project
  projectAction: ProjectAction[]
}


export interface MoodsCategories {
  category: string
}
export interface ProjectCategories {
  category: string
}
export interface ThoughtCategories {
  category: string
}
export interface Data {
  type:string
  data: Observable<ProjectAction[]|Mood[]|Thought[]>
}

