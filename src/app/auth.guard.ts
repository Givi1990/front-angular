import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn(); // Проверяем, аутентифицирован ли пользователь
    if (!isLoggedIn) {
      this.router.navigate(['/login']); // Перенаправляем на страницу логина, если не аутентифицирован
      return false;
    }
    return true; // Разрешаем доступ, если пользователь аутентифицирован
  }
}
