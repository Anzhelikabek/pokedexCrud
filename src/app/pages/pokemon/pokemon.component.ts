import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {JsonPipe, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule} from '@angular/forms';
import {LeadingZerosPipe} from '../../pipes/leading-zeros.pipe';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink, RouterOutlet} from '@angular/router';
import {PokemonIdComponent} from '../pokemon-id/pokemon-id.component';
import {TranslationService} from '../../data/services/translation.service';
import {NavbarComponent} from "../../component/navbar/navbar.component";
import {HttpClient} from '@angular/common/http';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {FooterComponent} from '../../component/footer/footer.component';
import {AuthService} from '../../data/services/auth.service';
import {CrudCrudService} from '../../data/services/crud-crud.service';
import Swal from 'sweetalert2';
import {PokemonFormDialogComponent} from '../../component/pokemon-form-dialog/pokemon-form-dialog.component';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, MatPaginatorModule, MatDialogModule, NgForOf, JsonPipe, TitleCasePipe, MatPaginator, NgIf, FormsModule, LeadingZerosPipe, MatButton, NgClass, RouterLink, PokemonIdComponent, NavbarComponent, RouterOutlet, MatIconButton, MatProgressSpinner, FooterComponent],
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit{
  loading: boolean = false;
  pokemons: any[] = [];
  totalPokemons = 0;
  pageSize = 5;
  searchTerm: string = ''; // Для хранения данных поиска
  translations: any = {};
  totalPages = 0; // Общее количество страниц
  isAdmin: boolean = false;
  currentPage = 1; // Текущая страница

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: AuthService, private translationService: TranslationService, private http: HttpClient, private dialog: MatDialog, private crudCrudService: CrudCrudService) {
  }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(() => {
      this.updateTranslations();
    });
    const userEmail = localStorage.getItem('userEmail'); // Получаем email пользователя
    this.isAdmin = this.authService.isAdmin(userEmail || '');
    console.log(userEmail)
    console.log(this.isAdmin)
    if (!this.isAdmin) {
      console.log('CRUD недоступен для этого пользователя');
    }
    this.loadPokemons();
  }
  openAddDialog(): void {
    if (!this.isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Доступ запрещен',
        text: 'У вас нет прав для добавления покемонов!',
      });
      return;
    }
    const dialogRef = this.dialog.open(PokemonFormDialogComponent, {
      width: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newPokemon = {
          name: result.name,
          description: result.description,
          height: result.height,
          weight: result.weight,
          image: result.image,
          types: result.types, // Сохраняем типы
        };

        this.crudCrudService.addPokemon(newPokemon).subscribe(
          (response) => {
            // Успешное добавление
            this.pokemons.push(response); // Добавляем новый покемон в локальный массив
            this.totalPokemons++; // Обновляем общее количество покемонов
            this.totalPages = Math.ceil(this.totalPokemons / this.pageSize); // Пересчитываем страницы

            Swal.fire({
              icon: 'success',
              title: 'Добавлено!',
              text: `Покемон "${response.name}" был успешно добавлен.`,
            });
          },
          (error) => {
            console.error('Ошибка при добавлении покемона:', error);
            Swal.fire({
              icon: 'error',
              title: 'Ошибка',
              text: 'Не удалось добавить покемона. Попробуйте снова.',
            });
          }
        );
      }
    });
  }
  openEditDialog(pokemon: any): void {
    if (!this.isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Доступ запрещен',
        text: 'У вас нет прав для редактирования покемонов!',
      });
      return;
    }

    const dialogRef = this.dialog.open(PokemonFormDialogComponent, {
      width: '600px',
      data: { pokemon },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.crudCrudService.updatePokemon(pokemon._id, result).subscribe(
          () => {
            // Обновляем локальный массив вручную
            const index = this.pokemons.findIndex((p) => p._id === pokemon._id);
            if (index > -1) {
              this.pokemons[index] = { ...pokemon, ...result }; // Обновляем данные локально
            }

            Swal.fire({
              icon: 'success',
              title: 'Обновлено!',
              text: `Покемон "${result.name}" успешно обновлен.`,
            });
          },
          (error) => {
            console.error('Ошибка при обновлении покемона:', error);
            Swal.fire({
              icon: 'error',
              title: 'Ошибка',
              text: 'Не удалось обновить покемона. Попробуйте снова.',
            });
          }
        );
      } else {
        console.log('Диалоговое окно было закрыто без изменений.');
      }
    });
  }

  deletePokemon(pokemon: any): void {
    if (!this.isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Доступ запрещен',
        text: 'У вас нет прав для удаления покемонов!',
      });
      return;
    }

    Swal.fire({
      title: 'Вы уверены?',
      text: 'Вы не сможете вернуть удалённого покемона!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да, удалить!',
      cancelButtonText: 'Отмена',
    }).then((result) => {
      if (result.isConfirmed) {

        this.crudCrudService.deletePokemon(pokemon._id).subscribe(
          () => {
            // Успешное удаление
            this.pokemons = this.pokemons.filter((p) => p._id !== pokemon._id); // Удаляем из массива
            this.totalPokemons--; // Обновляем общее количество
            this.totalPages = Math.ceil(this.totalPokemons / this.pageSize); // Обновляем страницы

            Swal.fire({
              icon: 'success',
              title: 'Удалено!',
              text: 'Покемон был успешно удален.',
            });
          },
          (error) => {
            console.error('Ошибка при удалении покемона:', error);

            Swal.fire({
              icon: 'error',
              title: 'Ошибка',
              text: 'Не удалось удалить покемона. Попробуйте снова.',
            });
          }
        );
      }
    });
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
      this.crudCrudService.searchPokemon(this.searchTerm).subscribe(
        (filteredPokemons: any[]) => {
          if (filteredPokemons.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Покемон не найден',
              text: `Покемон с именем "${this.searchTerm}" не найден.`,
            });
          } else {
            this.pokemons = filteredPokemons;

            // Обновляем пагинацию
            this.totalPokemons = filteredPokemons.length;
            this.totalPages = Math.ceil(this.totalPokemons / this.pageSize);
            this.currentPage = 1; // Сбрасываем текущую страницу на первую
          }
        },
        (error) => {
          console.error('Ошибка при поиске покемонов:', error);
          Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: 'Не удалось выполнить поиск. Попробуйте снова.',
          });
        }
      );
    } else {
      this.loadPokemons();
    }
  }

  loadPokemons(): void {
    this.crudCrudService.getPokemons().subscribe(
      (data: any[]) => {
        setTimeout(() => {
          this.totalPokemons = data.length; // Общее количество покемонов
          this.totalPages = Math.ceil(this.totalPokemons / this.pageSize); // Общее количество страниц

          // Фильтруем покемонов для текущей страницы
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          this.pokemons = data.slice(startIndex, endIndex); // Покемоны для текущей страницы

          this.loading = true;
        }, 1000); // Добавляем задержку в 1 секунду
      },
      (error) => {
        console.error('Ошибка при загрузке покемонов:', error);
        this.loading = false;
      }
    );
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPokemons();
    }
  }
}
