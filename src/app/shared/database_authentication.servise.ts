import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
//import Firebase;


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

interface CreateResponse {
  name: string
  category: string
  o_thought: string
}

@Injectable({providedIn: 'root'})
export class DatabaseService {
  // static url = 'https://myorganizer-e93d5.firebaseio.com/thoughts'
  static urlT = 'https://myorganizerpb.firebaseio.com/thoughts'

  constructor(private http: HttpClient) {
    /* var firebaseConfig = {
       apiKey: "AIzaSyCCKiJMSXRKJjj-A3nJMWOuy9gqyD6wjks",
       authDomain: "myorganizer-e93d5.firebaseapp.com",
       databaseURL: "https://myorganizer-e93d5.firebaseio.com",
       projectId: "myorganizer-e93d5",
       storageBucket: "myorganizer-e93d5.appspot.com",
       messagingSenderId: "262625297861",
       appId: "1:262625297861:web:7c887106bcece8fd4377ac"
     };

     */
    // Initialize Firebase
    // firebase: Firebase();
    // firebase.configure()
    //  firebase.initializeApp(firebaseConfig);

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

  createT(thought: Thought): Observable<Thought> {
    return this.http
      .post<CreateResponse>(`${DatabaseService.urlT}/${thought.date}.json`, thought)
      .pipe(map(res => {
        return {...thought, id: res.name}
      }))
  }



  removeT(thought: Thought): Observable<void> {
    return this.http
      .delete<void>(`${DatabaseService.urlT}/${thought.date}/${thought.id}.json`)
  }

}
