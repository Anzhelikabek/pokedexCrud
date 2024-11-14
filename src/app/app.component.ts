import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PokemonComponent} from './pages/pokemon/pokemon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PokemonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokeDex';
}
