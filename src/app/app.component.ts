import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PokemonComponent} from './pages/pokemon/pokemon.component';
import {NavbarComponent} from './component/navbar/navbar.component';
import {LanguageSwitcherComponent} from './component/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PokemonComponent, NavbarComponent, LanguageSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokeDex';
}
