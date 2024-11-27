import {Component, ViewChild} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AuthService} from '../../data/services/auth.service';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import {MatSidenav, MatSidenavContainer} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {NgForOf, NgIf} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {TranslationService} from '../../data/services/translation.service';  // Импортируем CookieService
import {signInWithEmailAndPassword, Auth} from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIcon,
    LanguageSwitcherComponent,
    RouterOutlet,
    MatButton,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatIconButton,
    NgForOf,
    MatToolbar,
    NgIf,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isDarkTheme = false; // начальное значение светлой темы
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMenuOpen = false;
  translations: any = {};

  constructor(private translationService: TranslationService, private cookieService: CookieService, private authService: AuthService, private router: Router) {
    // Проверяем значение темы в cookies при загрузке
    const savedTheme = this.cookieService.get('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme(); // Применяем сохраненную тему
    }
  }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(() => {
      this.updateTranslations();
    });
  }

  private updateTranslations(): void {
    this.translationService.getTranslation('logOut').subscribe(translation => {
      this.translations.logOut = translation;
    });
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
        this.isMenuOpen = false;
        this.router.navigate(['/login']).then(() => {
          window.location.reload();
        });
      })
      .catch(err => alert('Error signing out: ' + err.message));
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Открыть/закрыть выпадающее меню
  }

  closeMenu(): void {
    this.isMenuOpen = false; // Закрыть меню при клике на затемняющий фон
  }
}
