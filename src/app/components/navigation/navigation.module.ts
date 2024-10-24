// navigation.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule
  ],
  exports: [NavigationComponent] // Экспортируем компонент для использования в AppModule
})
export class NavigationModule { }
