import {Component} from '@angular/core';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButton, MatButtonModule, MatIconButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../data/services/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatIcon,
    MatIconButton,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true; // Скрывать пароль по умолчанию

  constructor(private authService: AuthService, private router: Router) {
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword; // Переключаем состояние
  }
  onLogin() {
    this.authService.login(this.email, this.password)
      .then(() => {
        this.router.navigate(['/pokemon']);
        this.clearInputs();
      })
      .catch(err => {
        alert('Login failed: ' + err.message);
        this.clearInputs(); // Очистка инпутов в случае ошибки
      });
  }

  clearInputs() {
    this.email = '';
    this.password = '';
  }
}
