import {Component, EventEmitter, HostBinding, inject, Output, ViewChild} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {PokemonDetailsComponent} from '../../component/pokemon-details/pokemon-details.component';
import {PokemonService} from '../../data/services/pokemon.service';
import {JsonPipe, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule} from '@angular/forms';
import {LeadingZerosPipe} from '../../pipes/leading-zeros.pipe';
import {FlavorTextEntry} from '../../data/interfaces/pokemon'
import {MatButton} from '@angular/material/button';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, MatPaginatorModule, MatDialogModule, PokemonDetailsComponent, NgForOf, JsonPipe, TitleCasePipe, MatPaginator, NgIf, FormsModule, LeadingZerosPipe, PokemonDetailsComponent, MatButton, NgClass],
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent {
  pokemonService = inject(PokemonService);
  pokemons: any[] = [];
  totalPokemons = 0;
  pageSize = 20;
  pageIndex = 0;
  searchTerm: string = ''; // Для хранения данных поиска
  isModalOpen = false;
  selectedPokemonName: string = ''; // Объявляем переменную для хранения имени выбранного покемона
  isDarkTheme = false; // начальное значение светлой темы
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog) {
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    // console.log(this.isDarkTheme ? 'Dark theme' : 'Light theme');

    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    const offset = this.pageIndex * this.pageSize;
    this.pokemonService.fetchPokemon(offset, this.pageSize).subscribe(
      data => {
        this.totalPokemons = data.count;
        this.pokemons = [];
        // Для каждого покемона делаем запрос, чтобы получить детализированные данные
        data.results.forEach((pokemon: any) => {
          this.pokemonService.getPokemonDetails(pokemon.url).subscribe(
            details => {
              // Получаем описание покемона с помощью нового запроса
              this.pokemonService.getPokemonSpecies(details.id).subscribe(
                species => {
                  // Типизируем 'flavor_text_entries'
                  const description = species.flavor_text_entries.find((entry: FlavorTextEntry) => entry.language.name === 'en')?.flavor_text || 'No description available';

                  // Добавляем детализированные данные к каждому покемону
                  this.pokemons.push({
                    name: details.name,
                    id: details.id,
                    image: details.sprites.front_default,
                    types: details.types.map((type: any) => type.type.name), // Список типов
                    description: description // Динамическое описание
                  });
                },
                error => console.error('Error fetching species details:', error)
              );
            },
            error => console.error('Error fetching details:', error)
          );
        });
      },
      error => {
        console.error('Error fetching pokemons:', error);
      }
    );
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.pokemonService.getPokemon(this.searchTerm.toLowerCase()).subscribe(
        data => {
          this.pokemons = []
          let objToArr = [data]
          objToArr.forEach((pokemon: any) => {
            this.pokemonService.getPokemonSpecies(pokemon.id).subscribe(
              species => {
                const description = species.flavor_text_entries.find((entry: FlavorTextEntry) => entry.language.name === 'en')?.flavor_text || 'No description available';
                this.pokemons.push({
                  name: pokemon.name,
                  id: pokemon.id,
                  image: pokemon.sprites.front_default,
                  types: pokemon.types.map((type: any) => type.type.name),
                  description: description
                });
              },
              error => console.error('Error fetching species details:', error)
            );
          });
        },
        error => console.error('Pokemon not found:', error)
      );
    } else {
      this.loadPokemons();
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPokemons();
  }

  openPokemonDetails(pokemon: any): void {
    // console.log(pokemon)
    this.isModalOpen = true
    this.dialog.open(PokemonDetailsComponent, {
      width: '900px',
      panelClass: 'custom-dialog-container',
      data: pokemon,
    });
  }

}
