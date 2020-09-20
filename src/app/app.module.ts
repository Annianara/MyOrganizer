import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Main_pageComponent } from './main_page/main_page.component';
import {SelectorComponent} from "./selector/selector.component";
import {CalendarComponent} from "./calendar/calendar.component";

import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MomentPipe} from "./shared/moment.pipe";
import { ProjectsComponent } from './projects/projects.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';


import {DemoMaterialModule} from '../app/material-module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule, } from '@angular/material/autocomplete';
import {MatInputModule } from '@angular/material/input';
import { AddTCategoryComponent } from './add-t-category/add-t-category.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MoodComponent } from './main_page/mood/mood.component';
import { ThoughtsComponent } from './main_page/thoughts/thoughts.component';




@NgModule({
  declarations: [
    AppComponent,
    Main_pageComponent,
    MomentPipe,
    SelectorComponent,
    CalendarComponent,
    ProjectsComponent,
    NavbarComponent,
    AddTCategoryComponent,
    AuthenticatedComponent,
    LoginPageComponent,
    MoodComponent,
    ThoughtsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,

    DemoMaterialModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
