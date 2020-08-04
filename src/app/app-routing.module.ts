import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {Main_pageComponent} from './main_page/main_page.component';
import {ProjectsComponent} from "./projects/projects.component";


const routes: Routes = [
  {path: '', component: Main_pageComponent},
  {path: 'projects', component: ProjectsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
