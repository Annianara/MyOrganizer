import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {Subject} from "rxjs";
import {User} from "./user.model";
import {throwError} from "rxjs";
import {Router} from "@angular/router";

export interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(User) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`, User)
      .pipe(catchError(this.handleError),
        tap(this.setToken),
        tap(resData=>
      {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }
       ))
  }
  login( User ) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, User)
      .pipe(catchError(this.handleError),
        tap(this.setToken),
        tap(resData=>
          {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
          }
        )
      )
  }

  private handleError(errorRes: HttpErrorResponse)
  {
    let errorMessage = 'An unknown message occured!'
    if(!errorRes.error || !errorRes.error.error)
    {return throwError(errorMessage)}
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
       errorMessage = 'This email exists already'
        break
      case 'EMAIL_NOT_FOUND':
        errorMessage  = 'This email does not exists'
        break
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct'
        break
    }
    return throwError(errorMessage)
  }
  private handleAuthentication(email: string, userId:string, token: string, expiresIn: number)
  {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate )
    this.user.next(user);
    this.autoLogout(expiresIn * 1000)
    // localStorage.setItem('userData', JSON.stringify(user)) //если я буду хранить все юзер данные в локалсторадже
  }

  private setToken (response) {
    if (response) {
      const expData = new Date( new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token-exp', expData.toString())
      localStorage.setItem('fb-token', response.idToken)
    } else {
      localStorage.clear()
    }
  }

  get token () {
    const expDate = new Date(new Date(localStorage.getItem('fb-token-exp')).getTime())
    if ( new Date > expDate ) {
      this.logout()
      return null
    }
    else
    {
      const expirationDuration =
        new Date(localStorage.getItem('fb-token-exp')).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
    return localStorage.getItem('fb-token')
  }

  autoLogout(expirationDuration: number)
  {
    this.tokenExpirationTimer = setTimeout(()=>this.logout(), expirationDuration)
  }
  logout() {
    if(this.tokenExpirationTimer)
    {
      clearTimeout(this.tokenExpirationTimer)
      // console.log("tokenExpiration:" + this.tokenExpirationTimer)
      this.router.navigate(['login'])
    }
    this.tokenExpirationTimer = null
    this.setToken(null)
  }

  isAuthenticated() {
    return !!this.token
  }
}
