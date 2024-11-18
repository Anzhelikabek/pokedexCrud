import { Routes } from '@angular/router';
import {PokemonComponent} from "./pages/pokemon/pokemon.component";
import {PokemonIdComponent} from "./pages/pokemon-id/pokemon-id.component";

export const routes: Routes = [
  {path: '', component: PokemonComponent},
  { path: 'pokemon/:name', component: PokemonIdComponent }
];
