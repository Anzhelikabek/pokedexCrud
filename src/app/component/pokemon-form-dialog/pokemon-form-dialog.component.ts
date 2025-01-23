import { Component, Inject, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslationService } from '../../data/services/translation.service';
import {MatError, MatFormField} from '@angular/material/form-field';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pokemon-form-dialog',
  templateUrl: './pokemon-form-dialog.component.html',
  styleUrls: ['./pokemon-form-dialog.component.scss'],
  imports: [
    MatFormField,
    MatError,
    NgIf,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    TitleCasePipe,
    NgForOf,
    MatIconButton,
    MatOption,
    MatIcon,
    MatDialogActions,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule
  ]
})
export class PokemonFormDialogComponent implements OnInit {
  form: FormGroup;
  translations: any = {};
  previewImage: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;

  types = [
    { name: 'grass', color: '#48d0b0' },
    { name: 'poison', color: '#9f5bba' },
    { name: 'normal', color: '#A8A77A' },
    { name: 'fire', color: '#EE8130' },
    { name: 'water', color: '#6390F0' },
    { name: 'electric', color: '#F7D02C' },
    { name: 'ice', color: '#96D9D6' },
    { name: 'fighting', color: '#C22E28' },
    { name: 'ground', color: '#E2BF65' },
    { name: 'flying', color: '#A98FF3' },
    { name: 'psychic', color: '#F95587' },
    { name: 'bug', color: '#A6B91A' },
    { name: 'rock', color: '#B6A136' },
    { name: 'ghost', color: '#735797' },
    { name: 'dark', color: '#705746' },
    { name: 'dragon', color: '#6F35FC' },
    { name: 'steel', color: '#B7B7CE' },
    { name: 'fairy', color: '#D685AD' },
  ];

  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService,
    public dialogRef: MatDialogRef<PokemonFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Если есть данные, компонент работает в режиме редактирования
  ) {
    this.form = this.fb.group({
      name: [data?.pokemon?.name || '', [Validators.required, Validators.minLength(3)]],
      image: [data?.pokemon?.image || null, Validators.required],
      description: [data?.pokemon?.description || '', [Validators.required, Validators.maxLength(200)]],
      height: [data?.pokemon?.height || 0, [Validators.required, Validators.min(0)]],
      weight: [data?.pokemon?.weight || 0, [Validators.required, Validators.min(0)]],
      types: [data?.pokemon?.types || []],
      stats: this.fb.array(
        (data?.pokemon?.stats || this.defaultStats()).map((stat: any) =>
          this.createStat(stat.name, stat.value)
        )
      ),
      newAbility: [''],
    });

    this.previewImage = data?.pokemon?.image || null;
  }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(() => {
      this.updateTranslations();
    });
  }

  private updateTranslations(): void {
    const keys = [
      'name',
      'theNameIsRequired',
      'theNameMustBeAtLeast3CharactersLong',
      'uploadAnImage',
      'uploadingAnImageIsRequired',
      'height',
      'theHeightMustBeGreaterThan0',
      'weight',
      'theWeightMustBeGreaterThan0',
      'description',
      'aDescriptionIsRequired',
      'descriptionShouldMax200',
      'selectTheTypes',
      'skills',
      'addASkill',
      'specifications',
      'cancel',
      'save',
      'addNewPokemon',
      'editPokemon',
    ];

    keys.forEach((key) =>
      this.translationService.getTranslation(key).subscribe((translation) => {
        this.translations[key] = translation;
      })
    );
  }

  get stats(): FormArray {
    return this.form.get('stats') as FormArray;
  }

  createStat(name: string, value: number = 0): FormGroup {
    return this.fb.group({
      name: [name],
      value: [value, [Validators.min(0)]],
    });
  }

  defaultStats(): any[] {
    return [
      { name: 'HP', value: 0 },
      { name: 'Attack', value: 0 },
      { name: 'Defense', value: 0 },
      { name: 'Special-Attack', value: 0 },
      { name: 'Special-Defense', value: 0 },
      { name: 'Speed', value: 0 },
    ];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      this.form.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addAbility(): void {
    const newAbility = this.form.get('newAbility')?.value;

    if (newAbility && newAbility.trim()) {
      this.data.pokemon?.abilities.push(newAbility.trim());
      this.form.patchValue({ newAbility: '' });
    }
  }

  removeAbility(index: number): void {
    this.data.pokemon?.abilities.splice(index, 1);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const updatedData = {
        ...this.data?.pokemon,
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        height: this.form.get('height')?.value,
        weight: this.form.get('weight')?.value,
        image: this.previewImage,
        types: this.form.get('types')?.value,
        stats: this.form.get('stats')?.value,
        abilities: this.data.pokemon?.abilities || [],
      };

      this.dialogRef.close(updatedData);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
