import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Main_pageComponent} from './main_page/main_page.component';
import {ProjectsComponent} from "./projects/projects.component";
import {AuthenticatedComponent} from "./authenticated/authenticated.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {RegistrationComponent} from "./registration/registration.component";
import {LoginPageComponent} from "./login-page/login-page.component";



const routes: Routes = [
  {path: 'sign-in', component: SignInComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'authentication', component: LoginPageComponent},
  //{path: 'authenticated', component: AuthenticatedComponent, children:
    //  [{path: 'projects', component: ProjectsComponent}]},
  {path: '', component: Main_pageComponent},
    //  {path: '', component: SignInComponent, pathMatch: 'full'},
  {path: '**', component:SignInComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
