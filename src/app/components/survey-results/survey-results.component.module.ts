import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SurveyResultsComponent } from './survey-results.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SurveyResultsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: SurveyResultsComponent } // маршрутизация для Survey Details
    ])
  ],
  exports: []
})
export class SurveyResultsModule { }
