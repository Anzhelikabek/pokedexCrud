import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';  // Импортируем CookieService

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>('en');
  private translations = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private cookieService: CookieService) {
    // Получаем язык из cookies или используем 'en' по умолчанию
    const savedLang = this.cookieService.get('language') || 'en';
    this.currentLang.next(savedLang);
    this.loadTranslations(savedLang);  // Загружаем переводы для выбранного языка
  }

  setLanguage(lang: string): void {
    this.currentLang.next(lang);
    this.cookieService.set('language', lang);  // Сохраняем выбранный язык в cookies
    this.loadTranslations(lang);  // Загружаем переводы для выбранного языка
  }

  getTranslation(key: string): Observable<string> {
    return this.translations.pipe(map(trans => trans[key] || key));
  }

  private loadTranslations(lang: string): void {
    this.http.get(`/assets/i18n/${lang}.json`).subscribe(translations => {
      this.translations.next(translations);
    });
  }

  // Геттер для currentLang, чтобы можно было подписываться на его изменения
  get currentLang$(): Observable<string> {
    return this.currentLang.asObservable();
  }
}
