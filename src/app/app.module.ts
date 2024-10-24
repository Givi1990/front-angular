// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { SurveyBuilderModule } from './components/survey-builder/survey-builder.module';
import { SurveyDetailsModule } from './components/survey-details/survey-details.module';
import { SlideBarModule } from './components/slide-bar/slide-bar.module';
import { UserPageModule } from './components/user-page/user-page.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRegistrModule } from './components/user-registr/user-registr.module';
import { UserLoginModule } from './components/user-login/user-login.module';
import { SearchModule } from './components/search/search.module';
import { NavigationModule } from './components/navigation/navigation.module';
import { FooterModule } from './components/footer/footer.module';
import { EditSurveyModule } from './components/edit-survey/edit-survey.module';
import { SurveyResultsModule } from './components/survey-results/survey-results.component.module';
import { AdminPageModule } from './components/admin-page/admin-page.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardModule,
    NavigationModule,
    SlideBarModule, 
    SurveyBuilderModule,
    SurveyDetailsModule,
    UserPageModule,
    UserRegistrModule,
    UserLoginModule,
    SearchModule,
    FooterModule,
    EditSurveyModule,
    SurveyResultsModule,
    AdminPageModule,
    NgbModule


    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
