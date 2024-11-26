import {Component} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {MatOption, MatSelect} from '@angular/material/select';
import {TranslationService} from '../../data/services/translation.service';

@Component({
  selector: 'app-pokemon-add-dialog',
  standalone: true,
  templateUrl: './pokemon-add-dialog.component.html',
  styleUrls: ['./pokemon-add-dialog.component.scss'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgForOf,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSelect,
    TitleCasePipe,
    MatOption,
    ReactiveFormsModule,
    NgIf,
  ],
})
export class PokemonAddDialogComponent {
  pokemon = {
    name: '',
    height: 0,
    weight: 0,
    image: '',
    description: '',
    abilities: [] as string[],
    types: [] as string[],
    stats: [
      {name: 'HP', value: 0},
      {name: 'Attack', value: 0},
      {name: 'Defense', value: 0},
      {name: 'Special-Attack', value: 0},
      {name: 'Special-Defense', value: 0},
      {name: 'Speed', value: 0},
    ],
  };
  newType = ''; // Для нового типа
  newAbility = ''; // Для нового умения
  form: FormGroup;
  translations: any = {};
  previewImage: string | ArrayBuffer | null = null; // Для предварительного просмотра
  selectedFileName: string | null = null; // Для отображения имени файла

  types = [
    {name: 'grass', color: '#48d0b0'},
    {name: 'poison', color: '#9f5bba'},
    {name: 'normal', color: '#A8A77A'},
    {name: 'fire', color: '#EE8130'},
    {name: 'water', color: '#6390F0'},
    {name: 'electric', color: '#F7D02C'},
    {name: 'ice', color: '#96D9D6'},
    {name: 'fighting', color: '#C22E28'},
    {name: 'ground', color: '#E2BF65'},
    {name: 'flying', color: '#A98FF3'},
    {name: 'psychic', color: '#F95587'},
    {name: 'bug', color: '#A6B91A'},
    {name: 'rock', color: '#B6A136'},
    {name: 'ghost', color: '#735797'},
    {name: 'dark', color: '#705746'},
    {name: 'dragon', color: '#6F35FC'},
    {name: 'steel', color: '#B7B7CE'},
    {name: 'fairy', color: '#D685AD'},
  ];
  constructor(private translationService: TranslationService, private fb: FormBuilder, public dialogRef: MatDialogRef<PokemonAddDialogComponent>) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      image: [null, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      height: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      types: [[]],
      stats: this.fb.array(
        [
          this.createStat('HP'),
          this.createStat('Attack'),
          this.createStat('Defense'),
          this.createStat('Special-Attack'),
          this.createStat('Special-Defense'),
          this.createStat('Speed'),
        ],
      ),
      newAbility: [''],
    });
  }
  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(() => {
      this.updateTranslations();
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

  get stats(): FormArray {
    return this.form.get('stats') as FormArray;
  }
  createStat(name: string): FormGroup {
    return this.fb.group({
      name: [name],
      value: [0, [Validators.min(0)]],
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFileName = file.name; // Сохраняем имя файла
      this.form.patchValue({ image: file }); // Сохраняем файл в форме

      // Создаем предварительный просмотр изображения
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  getTypeColor(typeName: string): string {
    const type = this.types.find((t) => t.name === typeName);
    return type ? type.color : '#ccc';
  }
  compareTypes(t1: string, t2: string): boolean {
    return t1 === t2;
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  onSave(): void {
    if (this.form.valid) {
      const imagePreview = this.previewImage; // Используем предварительный просмотр

      const dataToClose = {
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        height: this.form.get('height')?.value,
        weight: this.form.get('weight')?.value,
        image: imagePreview, // Передаём URL (base64) изображения
        types: this.form.get('types')?.value, // Добавляем выбранные типы
      };

      this.dialogRef.close(dataToClose); // Закрываем модальное окно с данными
    } else {
      this.form.markAllAsTouched();
    }
  }
  addAbility(): void {
    const newAbility = this.form.get('newAbility')?.value;

    if (newAbility && newAbility.trim()) { // Проверяем наличие значения и удаляем пробелы
      this.pokemon.abilities.push(newAbility.trim()); // Добавляем умение в массив
      this.form.patchValue({ newAbility: '' }); // Очищаем поле
    }
  }
  removeAbility(index: number): void {
    this.pokemon.abilities.splice(index, 1);
  }
}
