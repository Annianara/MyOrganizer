

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

export interface ProjectsAll{
  titleProject: string
  project: ProjectAction[]
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


