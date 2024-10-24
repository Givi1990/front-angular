import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyDetailsComponent } from './survey-details.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SurveyDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: SurveyDetailsComponent } // маршрутизация для Survey Details
    ])
  ],
  exports: [SurveyDetailsComponent]
})
export class SurveyDetailsModule { }
