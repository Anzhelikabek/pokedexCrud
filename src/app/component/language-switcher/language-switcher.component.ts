import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslationService } from '../../data/services/translation.service';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger; // Получаем доступ к MatAutocompleteTrigger

  languageControl = new FormControl('');
  languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' }
  ];
  translations: any = {};

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    // Подписываемся на изменения текущего языка, чтобы обновить переводы
    this.translationService.currentLang$.subscribe(langCode => {
      this.updateTranslations();
      // Устанавливаем язык в поле ввода
      const selectedLanguage = this.languages.find(language => language.code === langCode);
      this.languageControl.setValue(selectedLanguage ? selectedLanguage.name : '');
    });
  }

  // Метод для переключения языка
  switchLanguage(langCode: string): void {
    this.translationService.setLanguage(langCode); // Устанавливаем язык и сохраняем его в cookies
  }

  // Метод для обновления переводов
  private updateTranslations(): void {
    this.translationService.getTranslation('selectLanguage').subscribe(translation => {
      this.translations.selectLanguage = translation;
    });

    this.translationService.getTranslation('chooseLanguage').subscribe(translation => {
      this.translations.chooseLanguage = translation;
    });
  }
}
