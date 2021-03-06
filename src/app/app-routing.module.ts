import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Main_pageComponent} from './main_page/main_page.component';
import {LoginPageComponent} from "./auth/login-page/login-page.component";
import {AllProjectsComponent} from "./all_projects/all-projects.component";
import {AuthGuard} from "./auth/auth.guard";



const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: '',  component: Main_pageComponent, canActivate:[AuthGuard]},
  {path: 'main_page', component: Main_pageComponent, canActivate:[AuthGuard]},
  // {path: 'projects', component: AllProjectsComponent, canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

