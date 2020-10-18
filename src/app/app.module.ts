import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Main_pageComponent } from './main_page/main_page.component';
import {SelectorComponent} from "./main_page/selector/selector.component";

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MomentPipe} from "./shared/moment.pipe";
import { AllProjectsComponent } from './all_projects/all-projects.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';


import {DemoMaterialModule} from '../app/material-module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule, } from '@angular/material/autocomplete';
import {MatInputModule } from '@angular/material/input';
import { AddTCategoryComponent } from './main_page/add-t-category/add-t-category.component';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { MoodComponent } from './main_page/blocks/mood/mood.component';
import { ThoughtsComponent } from './main_page/blocks/thoughts/thoughts.component';
import { OthersComponent } from './main_page/blocks/others/others.component';
import {ProjectsComponent} from "./main_page/blocks/projects/projects.component";
import {AuthInterceptor} from "./auth/auth.interseptor";
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { HeaderComponent } from './header/header.component';
import { CalendarComponent } from './main_page/calendar/calendar.component';





@NgModule({
  declarations: [
    AppComponent,
    Main_pageComponent,
    MomentPipe,
    SelectorComponent,
    ProjectsComponent,
    AllProjectsComponent,
    AddTCategoryComponent,
    LoginPageComponent,
    MoodComponent,
    ThoughtsComponent,
    OthersComponent,
    LoadingSpinnerComponent,
    HeaderComponent,
    CalendarComponent,
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
  providers:  [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
