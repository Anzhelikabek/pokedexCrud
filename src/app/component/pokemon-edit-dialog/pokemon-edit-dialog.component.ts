import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {TranslationService} from '../../data/services/translation.service';

@Component({
  selector: 'app-pokemon-edit-dialog',
  standalone: true,
  templateUrl: './pokemon-edit-dialog.component.html',
  styleUrls: ['./pokemon-edit-dialog.component.scss'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class PokemonEditDialogComponent {
  pokemon: any;
  translations: any = {};

  constructor(
    private translationService: TranslationService,
    public dialogRef: MatDialogRef<PokemonEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pokemon = { ...data.pokemon };
  }

  ngOnInit(): void {
    this.translationService.currentLang$.subscribe(() => {
      this.updateTranslations();
    });
  }

  private updateTranslations(): void {
    this.translationService.getTranslation('name').subscribe(translation => {
      this.translations.name = translation;
    });
    this.translationService.getTranslation('description').subscribe(translation => {
      this.translations.description = translation;
    });
    this.translationService.getTranslation('cancel').subscribe(translation => {
      this.translations.cancel = translation;
    });
    this.translationService.getTranslation('imageURL').subscribe(translation => {
      this.translations.imageURL = translation;
    });
    this.translationService.getTranslation('save').subscribe(translation => {
      this.translations.save = translation;
    });
    this.translationService.getTranslation('editPokemon').subscribe(translation => {
      this.translations.editPokemon = translation;
    });
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.pokemon);
  }
}
