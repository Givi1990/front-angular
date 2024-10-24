import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EditSurveyComponent } from './edit-survey.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: EditSurveyComponent } // Путь по умолчанию для загрузки компонента
];

@NgModule({
  declarations: [EditSurveyComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes) // Убедитесь, что маршрутизация работает
  ]
})
export class EditSurveyModule {}
