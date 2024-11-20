import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import {Router, RouterOutlet} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../data/services/auth.service';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';  // Импортируем CookieService

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

  constructor(private cookieService: CookieService, private authService: AuthService, private router: Router) {
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
  onLogout() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userEmail = currentUser.email;
      const confirmation = confirm(`Are you sure you want to log out from ${userEmail}?`);
      if (!confirmation) {
        return;
      }
    }

    this.authService.logout()
      .then(() => {
        alert('You have been signed out');
        this.router.navigate(['/login']);
         // Перенаправление на страницу логина
      })
      .catch(err => alert('Error signing out: ' + err.message));
  }
}
