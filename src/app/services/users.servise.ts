import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { User } from '../interfaces/survey.model';
import {baseUrl} from './baseUrl'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }



  register(user: User): Observable<User | null> {
    const userData = {
        username: user.username,  
        email: user.email,
        password: user.password
    };

    return this.http.post<User>(`${baseUrl}/register`, userData).pipe(
      catchError(error => {
        console.error('Ошибка регистрации пользователя:', error);
        return of(null); 
      })
    );
}

}
