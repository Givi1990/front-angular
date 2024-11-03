import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { FormsModule } from '@angular/forms';  // Импортируем FormsModule
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        { path: '', component: UserProfileComponent } // маршрутизация для Dashboard
      ])
  ]
})
export class UserProfileModule { }
