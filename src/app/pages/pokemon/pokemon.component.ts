import {Component, EventEmitter, HostBinding, inject, Output, ViewChild} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {PokemonService} from '../../data/services/pokemon.service';
import {JsonPipe, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule} from '@angular/forms';
import {LeadingZerosPipe} from '../../pipes/leading-zeros.pipe';
import {FlavorTextEntry, Pokemon} from '../../data/interfaces/pokemon'
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink, RouterOutlet} from '@angular/router';
import {PokemonIdComponent} from '../pokemon-id/pokemon-id.component';
import {TranslationService} from '../../data/services/translation.service';
import {NavbarComponent} from "../../component/navbar/navbar.component";
import {HttpClient} from '@angular/common/http';
import {PokemonEditDialogComponent} from '../../component/pokemon-edit-dialog/pokemon-edit-dialog.component';
import {PokemonAddDialogComponent} from '../../component/pokemon-add-dialog/pokemon-add-dialog.component';
import {MatProgressSpinner, ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, MatPaginatorModule, MatDialogModule, NgForOf, JsonPipe, TitleCasePipe, MatPaginator, NgIf, FormsModule, LeadingZerosPipe, MatButton, NgClass, RouterLink, PokemonIdComponent, NavbarComponent, RouterOutlet, MatIconButton, MatProgressSpinner],
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent {
  pokemonService = inject(PokemonService);
  loading: boolean = false;
  pokemons: any[] = [];
  totalPokemons = 0;
  pageSize = 20;
  pageIndex = 0;
  searchTerm: string = ''; // Для хранения данных поиска
  translations: any = {};
  totalPages = 0; // Общее количество страниц
  pageSizeOptions = [10, 20, 50]; // Возможные размеры страниц
  pages: number[] = [];
  private apiUrl = 'https://crucrud.com/api/d265aef63a8e4cfc914988231cced933/pokedex';
  // pokemonsCrud: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private translationService: TranslationService,private http: HttpClient, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(() => {
      this.updateTranslations();
    });
    this.loadPokemons();

  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(PokemonAddDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.pokemons.push({
          name: result.name,
          description: result.description,
          height: result.height,
          weight: result.weight,
          image: result.image,
          types: result.types, // Сохраняем типы
        });
      }
    });
  }
  openEditDialog(pokemon: any): void {
    const dialogRef = this.dialog.open(PokemonEditDialogComponent, {
      width: '600px',
      data: { pokemon },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
        if (index > -1) {
          this.pokemons[index] = result;
        }
      }
    });
  }
  deletePokemon(pokemon: any): void {
    const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
    if (index > -1) {
      this.pokemons.splice(index, 1); // Удаляем покемона из массива
    }
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
                  this.loading = true
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

  // postPokemons() {
  //   this.pokemons.forEach(pokemon => {
  //     this.http.post(this.apiUrl, pokemon).subscribe({
  //       next: response => {
  //         console.log('Успешно отправлено:', response);
  //       },
  //       error: error => {
  //         console.error('Ошибка при отправке:', error);
  //       },
  //     });
  //   });
  // }
  // getPokemons() {
  //   this.http.get<any[]>(this.apiUrl).subscribe({
  //     next: response => {
  //       this.pokemonsCrud = response; // Сохраняем полученные данные в массив
  //       console.log('Полученные данные:', this.pokemonsCrud);
  //     },
  //     error: error => {
  //       console.error('Ошибка при получении данных:', error);
  //     },
  //   });
  // }
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
