import { Component } from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../data/services/auth.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    RouterLink,
    FormsModule,
    NgIf,
    MatError
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}
  hidePassword: boolean = true; // Скрывать пароль по умолчанию

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword; // Переключаем состояние
  }
  onRegister() {
    if (!this.email || !this.password) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Registering with:', this.email, this.password);
    this.authService.register(this.email, this.password)
      .then(() => {
        alert('Registration successful!');
        this.router.navigate(['/pokemon']).then(r => window.location.reload()); // Перенаправление на страницу /pokemon

        this.clearInputs(); // Очистка инпутов
      })
      .catch(err => {
        alert('Registration failed: ' + err.message);
        this.clearInputs(); // Очистка инпутов в случае ошибки
      });
  }
  clearInputs() {
    this.email = '';
    this.password = '';
  }

  // onGoogleSignIn() {
  //   this.authService.googleSignIn()
  //     .then(user => alert(`Welcome, ${user.displayName}!`))
  //     .catch(err => alert(`Google Sign-In Failed: ${err.message}`));
  // }
}
