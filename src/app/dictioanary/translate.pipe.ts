// src/app/translate.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { dictionary } from './dictionary';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLang: 'en' | 'ru' = 'en';
  private langSubject = new BehaviorSubject<'en' | 'ru'>(this.currentLang);
  lang$ = this.langSubject.asObservable();

  constructor() {}

  setLanguage(lang: 'en' | 'ru') {
    this.currentLang = lang;
    this.langSubject.next(this.currentLang);
  }

  getTranslation(key: string): string {
    const keys = key.split('.');
    let result: any = dictionary.components[this.currentLang];
    for (const k of keys) {
      result = result?.[k] ?? key;
    }
    return result;
  }

  getCurrentLanguage() {
    return this.currentLang;
  }
}
