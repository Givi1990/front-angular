import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Импортируем AuthService

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.scss']
})
export class SlideBarComponent {

  isSidebarVisible: boolean = true;

  @Output() sidebarToggle = new EventEmitter<boolean>();

  constructor(private router: Router, private authService: AuthService) {}

  surveyBuilderNav() {
    if (this.authService.isLoggedIn()) { // Проверяем авторизацию
      this.router.navigate(['/survey-builder']); // Перенаправляем на страницу survey-builder
    } else {
      this.router.navigate(['/login']); // Если не авторизован, перенаправляем на login
    }
    
    // Закрываем боковую панель и отправляем событие
    // this.isSidebarVisible = !this.isSidebarVisible;
    // this.sidebarToggle.emit(this.isSidebarVisible);
  }
}
