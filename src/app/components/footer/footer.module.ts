import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: FooterComponent }
    ])
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
