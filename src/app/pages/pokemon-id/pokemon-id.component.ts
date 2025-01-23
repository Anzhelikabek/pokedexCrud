import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TranslationService} from '../../data/services/translation.service';
import {NavbarComponent} from "../../component/navbar/navbar.component";
import {FooterComponent} from '../../component/footer/footer.component';
import Swal from 'sweetalert2';
import {CrudCrudService} from '../../data/services/crud-crud.service';

@Component({
  selector: 'app-pokemon-id',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './pokemon-id.component.html',
  styleUrls: ['./pokemon-id.component.scss']
})
export class PokemonIdComponent implements OnInit {
  pokemon: any;
  private route = inject(ActivatedRoute);
  translations: any = {};

  constructor(private translationService: TranslationService, private crudCrudService: CrudCrudService) {}
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
    const pokemonId = this.route.snapshot.paramMap.get('_id');
    if (pokemonId) {
      // Делаем запрос, используя имя покемона
      this.crudCrudService.getPokemonDetails(pokemonId).subscribe(
        (data) => {
          console.log(data)
          this.pokemon = {
            ...data,
            image: data.image || 'default_image_url', // Установим заглушку для изображения
            description: data.description || 'No description available', // Заглушка для описания
          };
        },
        (error) => {
          console.error('Error fetching Pokemon details:', error);
          Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: 'Не удалось загрузить данные о покемоне. Попробуйте снова.',
          });
        }
      );
    }
  }
}
