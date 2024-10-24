import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Question, Survey, Response } from '../interfaces/survey.model';
import {baseUrl} from './baseUrl'

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  getUserAnswersForSurvey(surveyId: number) {
    throw new Error('Method not implemented.');
  }
  // private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // Получение токена и заголовков
  private getHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Токен отсутствует');
      return null;
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Унифицированный метод для обработки ошибок
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} не удался: ${error.message}`);
      return of(result as T); // Вернуть безопасный результат
    };
  }

  // Получение всех опросов
  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${baseUrl}/surveys`).pipe(
      catchError(this.handleError<Survey[]>('getSurveys', []))
    );
  }

  // Получение опроса по ID
  getSurveyById(id: number): Observable<Survey> {
    const headers = this.getHeaders();
    if (!headers) return of(null as any);

    return this.http.get<Survey>(`${baseUrl}/surveys/${id}`, { headers }).pipe(
      catchError(this.handleError<Survey>(`getSurveyById id=${id}`))
    );
  }

  // Получение вопросов опроса по ID
  getSurveyQuestions(surveyId: number): Observable<Question[]> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    return this.http.get<Question[]>(`${baseUrl}/surveys/${surveyId}/questions`, { headers }).pipe(
      catchError(this.handleError<Question[]>(`getSurveyQuestions surveyId=${surveyId}`, []))
    );
  }

  // Создание нового опроса
  createSurvey(surveyData: Survey): Observable<Survey> {
    const headers = this.getHeaders();
    if (!headers) return of(null as any);

    return this.http.post<Survey>(`${baseUrl}/surveys`, surveyData, { headers }).pipe(
      catchError(this.handleError<Survey>('createSurvey'))
    );
  }

  // Метод для редактирования опроса
  editSurvey(surveyId: number, surveyData: Survey): Observable<Survey> {
    const headers = this.getHeaders();
    if (!headers) return of(null as any);

    return this.http.put<Survey>(`${baseUrl}/surveys/${surveyId}`, surveyData, { headers }).pipe(
      catchError(this.handleError<Survey>('editSurvey'))
    );
  }

  // Метод для удаления опроса
deleteSurvey(surveyId: number): Observable<any> {
  const headers = this.getHeaders();
  if (!headers) return of(null as any);

  console.log(`Запрос на удаление опроса с ID: ${surveyId}`); // Логирование ID

  return this.http.delete(`${baseUrl}/surveys/${surveyId}`, { headers }).pipe(
    tap(response => console.log(`Опрос с ID ${surveyId} успешно удалён.`)), // Успешное удаление
    catchError((error) => {
      console.error(`Ошибка при удалении опроса с ID ${surveyId}:`, error); // Логирование ошибки
      return this.handleError<any>('deleteSurvey')(error); // Обработка ошибки
    })
  );
}


  // Добавление ответов на опрос
  submitResponses(surveyId: number, responses: Response[]): Observable<any> {
    const url = `${baseUrl}/submit-answers`; // Обновленный URL

    // Заголовки запроса
    const headers = this.getHeaders();
    if (!headers) return of([]);

    // Логируем данные перед отправкой
    console.log('Отправляемые данные:', { surveyId, responses });

    if (!Array.isArray(responses) || responses.length === 0) {
      console.error('Responses должны быть массивом и не могут быть пустыми');
      return throwError('Responses должны быть массивом и не могут быть пустыми');
    }

    // Отправка POST запроса
    return this.http
      .post(url, { surveyId, responses }, { headers })
      .pipe(
        catchError(this.handleError<any>('submitResponses'))
      );
  }

  // Поиск шаблонов
  searchTemplates(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseUrl}/surveys/search?term=${term}`).pipe(
      catchError((error) => {
        console.error('Ошибка при поиске шаблонов:', error);
        return throwError('Произошла ошибка; пожалуйста, попробуйте позже.');
      })
    );
  }

  // Получение созданных пользователем опросов
  getCreatedSurveys(userId: number): Observable<Survey[]> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    const url = `${baseUrl}/surveys/created/${userId}`;
    return this.http.get<Survey[]>(url, { headers }).pipe(
      tap((response) => console.log('Ответ от сервера:', response)),
      catchError((error) => {
        console.error('Ошибка при получении созданных опросов:', error);
        return of([]);
      })
    );
  }

 
  

  // Получение пройденных пользователем опросов
getCompletedSurveys(userId: number): Observable<Survey[]> {
  const headers = this.getHeaders();
  if (!headers) return of([]);

  const url = `${baseUrl}/surveys/completed/${userId}`;
  console.log('Запрос на завершенные опросы по URL:', url); // Логирование URL

  return this.http.get<Survey[]>(url, { headers }).pipe(
      tap((response) => console.log('Ответ от сервера:', response)), // Логирование ответа от сервера
      catchError(error => {
          console.error('Ошибка при получении завершенных опросов:', error); // Логирование ошибки
          return of([]); // Возвращаем пустой массив в случае ошибки
      })
  );
}


  getUserAnswersForSurveyByUser(surveyId: number, userId: number): Observable<Response[]> {
    const headers = this.getHeaders();
    if (!headers) return of([]); 
  
    const url = `${baseUrl}/surveys/${surveyId}/responses/${userId}`; 
    return this.http.get<Response[]>(url, { headers }).pipe(
      tap((response) => console.log('Полученные ответы пользователя:', response)), 
      catchError(this.handleError<Response[]>('getUserAnswersForSurvey', [])) 
    );
  }
  






  updateSurvey(survey: Survey): Observable<void> {
    const headers = this.getHeaders();
    if (!headers) return of();
    const url = `${baseUrl}/surveys/${survey.id}`;
    return this.http.put<void>(url, survey, { headers });
  }


}
