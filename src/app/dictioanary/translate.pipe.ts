// src/app/translate.service.ts
import { Injectable } from '@angular/core';
import { dictionary } from './dictionary'; // Путь к вашему словарю

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLang: 'en' | 'ru' = 'en'; // Начальный язык

  constructor() {}

  setLanguage(lang: 'en' | 'ru') {
    this.currentLang = lang;
  }

  getTranslation(key: string): string {
    const keys = key.split('.');
    let result: any = dictionary.components[this.currentLang];

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key; // вернуть ключ, если он не найден
      }
    }
    return result || key; // если ничего не найдено, вернуть ключ
  }

  getCurrentLanguage() {
    return this.currentLang;
  }
}
