import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page.component';

const routes: Routes = [
  { path: '', component: AdminPageComponent } // Путь по умолчанию для загрузки компонента
];

@NgModule({
  declarations: [AdminPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // Убедитесь, что маршрутизация работает
  ]
})
export class AdminPageModule {}
