import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {MatButton} from '@angular/material/button';  // Импортируем CookieService

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIcon,
    LanguageSwitcherComponent,
    RouterOutlet,
    MatButton
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isDarkTheme = false; // начальное значение светлой темы

  constructor(private cookieService: CookieService) {
    // Проверяем значение темы в cookies при загрузке
    const savedTheme = this.cookieService.get('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme(); // Применяем сохраненную тему
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    // Сохраняем выбранную тему в cookies
    this.cookieService.set('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }
}
