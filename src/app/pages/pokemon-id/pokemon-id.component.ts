// pokemon-id.component.ts
import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {PokemonService} from '../../data/services/pokemon.service';
import {CommonModule} from '@angular/common';
import {FlavorTextEntry} from '../../data/interfaces/pokemon';
import {TranslationService} from '../../data/services/translation.service';
import {NavbarComponent} from "../../component/navbar/navbar.component";

@Component({
  selector: 'app-pokemon-id',
  standalone: true,
    imports: [CommonModule, NavbarComponent, RouterOutlet],
  templateUrl: './pokemon-id.component.html',
  styleUrls: ['./pokemon-id.component.scss']
})
export class PokemonIdComponent implements OnInit {
  pokemon: any;
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  translations: any = {};

  constructor(private translationService: TranslationService) {}

  private updateTranslations(): void {
    this.translationService.getTranslation('height').subscribe(translation => {
      this.translations.height = translation;
    });

    this.translationService.getTranslation('weight').subscribe(translation => {
      this.translations.weight = translation;
    });

    this.translationService.getTranslation('stats').subscribe(translation => {
      this.translations.stats = translation;
    });

    this.translationService.getTranslation('abilities').subscribe(translation => {
      this.translations.abilities = translation;
    });
  }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(() => {
      this.updateTranslations();
    });
    const pokemonName = this.route.snapshot.paramMap.get('name');
    if (pokemonName) {
      // Делаем запрос, используя имя покемона
      this.pokemonService.getPokemon(pokemonName).subscribe((data) => {
        console.log(data)
        this.pokemonService.getPokemonSpecies(pokemonName).subscribe(
          species => {
            const description = species.flavor_text_entries.find((entry: FlavorTextEntry) => entry.language.name === 'en')?.flavor_text || 'No description available';
            this.pokemon = {
              name: data.name,
              id: data.id,
              image: data.sprites.front_default,
              types: data.types.map((type: any) => type.type.name),
              description: description,
              height: data.height,
              weight: data.weight,
              stats: data.stats.map((stat: any) => ({
                name: stat.stat.name,
                value: stat.base_stat
              })),
              abilities: data.abilities.map((ability: any) => ability.ability.name)
            };

            console.log(this.pokemon.stats)
          },
          error => console.error('Error fetching species details:', error)
        );
      });
    }
  }
}
