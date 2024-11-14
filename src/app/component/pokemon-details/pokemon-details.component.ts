import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, SimpleChanges} from '@angular/core';
import {PokemonService} from '../../data/services/pokemon.service';
import {DecimalPipe} from '@angular/common';
import {CommonModule} from '@angular/common';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  templateUrl: './pokemon-details.component.html',
  imports: [
    DecimalPipe, CommonModule
  ],
  styleUrls: ['./pokemon-details.component.scss']
})
export class PokemonDetailsComponent {
  @Input() pokemonName: string = '';
  @Output() dataLoaded = new EventEmitter<any>();
  pokemon: any = {
    id: null,
    name: '',
    height: null,
    weight: null,
    stats: [],
    abilities: [],
    types: [],
    image: '',
    description: ''
  };

  constructor(private pokemonService: PokemonService, private ngZone: NgZone) {
  }

  ngOnInit() {
    if (this.pokemonName) {
      this.loadPokemonDetails(this.pokemonName);
    }
  }

  loadPokemonDetails(pokemonName: string): void {
    this.pokemonService.getPokemon(pokemonName).subscribe(
      (data) => {
        this.ngZone.run(() => {
          if(data) {
            this.pokemon = {
              id: data.id,
              name: data.name,
              height: data.height,
              weight: data.weight,
              stats: data.stats.map((stat: any) => ({
                name: stat.stat.name,
                value: stat.base_stat,
              })),
              abilities: data.abilities.map((ability: any) => ability.ability.name),
              image: data.sprites.front_default,
            };
            console.log(this.pokemon)
            this.dataLoaded.emit(this.pokemon);
          }
        })
      }
    );
  }
}
