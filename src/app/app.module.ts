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


@NgModule({
  declarations: [
    AppComponent,
    Main_pageComponent,
    MomentPipe,
    SelectorComponent,
    CalendarComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
