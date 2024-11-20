import {Injectable} from '@angular/core';
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged, User
} from "firebase/auth";
import {firebaseApp} from '../../firebase.config'; // Убедитесь, что путь к файлу firebase.config.ts корректен

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(firebaseApp);
  private currentUser: User | null = null;
  constructor() {
    // Слушатель состояния аутентификации
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null; // Проверка авторизации
  }
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Метод для входа через email и пароль
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        console.log('Login Successful:', result.user);
        return result.user;
      })
      .catch((error) => {
        console.error('Login Failed:', error);
        throw error;
      });
  }

  // Метод для входа через Google
  googleSignIn() {
    const provider = new GoogleAuthProvider(); // Использование GoogleAuthProvider из Firebase
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;
        console.log('Google Sign-In Successful:', user);
        return user;
      })
      .catch((error) => {
        console.error('Error during Google Sign-In:', error);
        throw error;
      });
  }

  logout() {
    return signOut(this.auth)
      .then(() => {
        console.log('User signed out');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
        throw error;
      });
  }
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
