// slide-bar.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideBarComponent } from './slide-bar.component';

@NgModule({
  declarations: [SlideBarComponent],
  imports: [
    CommonModule
  ],
  exports: [SlideBarComponent] // Экспортируем компонент для использования в AppModule
})
export class SlideBarModule { }
