import { Routes } from '@angular/router';
import { PokemonComponent } from './pages/pokemon/pokemon.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PokemonIdComponent } from './pages/pokemon-id/pokemon-id.component';
import { redirectLoggedInTo, redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';

// Перенаправление для неавторизованных пользователей
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
// Перенаправление для авторизованных пользователей
const redirectLoggedInToPokemon = () => redirectLoggedInTo(['/pokemon']);

export const routes: Routes = [
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToPokemon) },
  { path: 'register', component: RegisterComponent, ...canActivate(redirectLoggedInToPokemon) },
  { path: 'pokemon', component: PokemonComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'pokemon/:_id', component: PokemonIdComponent },
];
