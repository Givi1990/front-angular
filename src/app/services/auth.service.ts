import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginResponse, User } from '../interfaces/survey.model';
import {baseUrl} from './baseUrl'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  // Метод для входа в систему
  login(username: string, password: string): Observable<LoginResponse> {
    const userCredentials = { username, password };
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Login URL:', `${baseUrl}login`); 
    
    return this.http.post<LoginResponse>(`${baseUrl}/login`, userCredentials)

      .pipe(
        catchError(error => {
          console.error('Ошибка при входе:', error);
          return throwError(() => new Error('Не удалось войти, попробуйте еще раз'));
        })
      );
  }

  // Проверка, авторизован ли пользователь
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor(new Date().getTime() / 1000);

    return expiry > now;
  }

  // Метод для сохранения токена
  saveToken(token: string): void {
    localStorage.setItem('token', token); // Сохраняем токен под ключом 'token'
  }

  // Получение всех пользователей
  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('Токен отсутствует')); // Возвращаем ошибку, если токен отсутствует
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Добавляем токен в заголовки запроса
    });

    return this.http.get<User[]>(`${baseUrl}/users`, { headers }).pipe(
      catchError(error => {
        console.error('Ошибка при получении пользователей:', error);
        return throwError(() => new Error('Не удалось получить пользователей')); // Обработка ошибки
      })
    );
  }

 // Метод для блокировки или разблокировки пользователя
toggleUserBlock(userId: string, action: 'block' | 'unblock'): Observable<any> {
  const token = localStorage.getItem('token');

  if (!token) {
    return throwError(() => new Error('Токен отсутствует'));
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  // Заменяем метод на PUT и добавляем действие в URL
  return this.http.put(`${baseUrl}/users/${userId}/${action}`, {}, { headers }).pipe(
    catchError(error => {
      console.error(`Ошибка при ${action}ировании пользователя:`, error);
      return throwError(() => new Error(`Не удалось ${action}ировать пользователя`));
    })
  );
}


  // Метод для удаления пользователя
  deleteUser(userId: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('Токен отсутствует'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`${baseUrl}/users/${userId}`, { headers }).pipe(
      catchError(error => {
        console.error('Ошибка при удалении пользователя:', error);
        return throwError(() => new Error('Не удалось удалить пользователя'));
      })
    );
  }

  // Метод для получения информации о пользователе
  getUserInfo(param: string): string | null {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Расшифровываем payload
        return payload[param] || null; // Возвращаем значение из payload по ключу param
      }
    } catch (error) {
      console.error('Ошибка декодирования токена', error);
    }
    return null; // Если токен отсутствует или произошла ошибка, возвращаем null
  }

  // Метод для выхода из системы
  logout(): void {
    localStorage.removeItem('token'); // Удаляем токен при выходе
  }
}
