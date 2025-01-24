import { Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToPokemon = () => redirectLoggedInTo(['/pokemon']);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    ...canActivate(redirectLoggedInToPokemon),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    ...canActivate(redirectLoggedInToPokemon),
  },
  {
    path: 'pokemon',
    loadComponent: () => import('./pages/pokemon/pokemon.component').then(m => m.PokemonComponent),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'pokemon/:_id',
    loadComponent: () => import('./pages/pokemon-id/pokemon-id.component').then(m => m.PokemonIdComponent),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
