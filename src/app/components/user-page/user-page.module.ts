import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPageComponent } from './user-page.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: UserPageComponent } // Путь по умолчанию для загрузки компонента
];

@NgModule({
  declarations: [UserPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // Убедитесь, что маршрутизация работает
  ]
})
export class UserPageModule {}
