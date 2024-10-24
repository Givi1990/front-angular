import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyBuilderComponent } from './survey-builder.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SurveyBuilderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, // Добавлено для работы с HttpClient
    RouterModule.forChild([
      { path: '', component: SurveyBuilderComponent } // маршрутизация для SurveyBuilder
    ])
  ],
  exports: [SurveyBuilderComponent]
})
export class SurveyBuilderModule { }
