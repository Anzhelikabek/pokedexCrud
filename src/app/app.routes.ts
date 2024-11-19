import { Routes } from '@angular/router';
import {PokemonComponent} from "./pages/pokemon/pokemon.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {PokemonIdComponent} from "./pages/pokemon-id/pokemon-id.component";

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'pokemon', component: PokemonComponent},
  {path: 'pokemon/:name', component: PokemonIdComponent }
];
