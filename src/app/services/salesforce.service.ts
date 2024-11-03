import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from './baseUrl'

@Injectable({
  providedIn: 'root'
})
export class SalesforceService {

  constructor(private http: HttpClient) {}


  createContact(data: any): Observable<any> {
    console.log('Отправка запроса на создание контакта с данными:', data);
    return this.http.post(`${baseUrl}/api/createContact`, data); 
  }
}
