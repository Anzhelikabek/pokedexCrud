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
import {RouterLink} from '@angular/router';
import {PokemonIdComponent} from '../pokemon-id/pokemon-id.component';
import {TranslationService} from '../../data/services/translation.service';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, MatPaginatorModule, MatDialogModule, PokemonDetailsComponent, NgForOf, JsonPipe, TitleCasePipe, MatPaginator, NgIf, FormsModule, LeadingZerosPipe, PokemonDetailsComponent, MatButton, NgClass, RouterLink, PokemonIdComponent],
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
  translations: any = {};
  totalPages = 0; // Общее количество страниц
  pageSizeOptions = [10, 20, 50]; // Возможные размеры страниц
  pages: number[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private translationService: TranslationService) {
  }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(() => {
      this.updateTranslations();
    });
    this.loadPokemons();

  }

  private updateTranslations(): void {
    this.translationService.getTranslation('knowMore').subscribe(translation => {
      this.translations.title = translation;
    });
    this.translationService.getTranslation('knowMore').subscribe(translation => {
      this.translations.knowMore = translation;
    });
    this.translationService.getTranslation('search').subscribe(translation => {
      this.translations.search = translation;
    });
  }
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.pokemonService.getPokemon(this.searchTerm.toLowerCase()).subscribe(
        data => {
          this.pokemons = []
          let objToArr = [data]
          objToArr.forEach((pokemon: any) => {
            console.log(pokemon)
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
  loadPokemons(): void {
    const offset = this.pageIndex * this.pageSize;
    this.pokemonService.fetchPokemon(offset, this.pageSize).subscribe(
      data => {
        this.totalPokemons = data.count;
        this.totalPages = Math.ceil(this.totalPokemons / this.pageSize);
        this.pages = this.generatePageNumbers(); // Генерация номеров страниц
        this.pokemons = []; // Сброс массива с покемонами
        // Для каждого покемона делаем запрос, чтобы получить детализированные данные
        data.results.forEach((pokemon: any) => {
          this.pokemonService.getPokemonDetails(pokemon.url).subscribe(
            details => {
              this.pokemonService.getPokemonSpecies(details.id).subscribe(
                species => {
                  const description = species.flavor_text_entries.find(
                    (entry: FlavorTextEntry) => entry.language.name === 'en'
                  )?.flavor_text || 'No description available';

                  this.pokemons.push({
                    name: details.name,
                    id: details.id,
                    image: details.sprites.front_default,
                    types: details.types.map((type: any) => type.type.name),
                    description: description
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

  generatePageNumbers(): number[] {
    // Логика для отображения страниц вокруг текущей
    let start = Math.max(1, this.pageIndex - 2);
    let end = Math.min(this.totalPages, this.pageIndex + 2);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  goToFirstPage() {
    this.pageIndex = 0;
    this.loadPokemons();
  }

  goToPreviousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadPokemons();
    }
  }

  goToPage(page: number) {
    this.pageIndex = page - 1;
    this.loadPokemons();
  }

  goToNextPage() {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.loadPokemons();
    }
  }

  goToLastPage() {
    this.pageIndex = this.totalPages - 1;
    this.loadPokemons();
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.totalPages = Math.ceil(this.totalPokemons / this.pageSize);
    this.pageIndex = 0; // сброс на первую страницу
    this.loadPokemons();
  }



}
