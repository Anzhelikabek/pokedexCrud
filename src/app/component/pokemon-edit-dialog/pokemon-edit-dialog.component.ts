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

  constructor(
    public dialogRef: MatDialogRef<PokemonEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pokemon = { ...data.pokemon };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.pokemon);
  }
}
