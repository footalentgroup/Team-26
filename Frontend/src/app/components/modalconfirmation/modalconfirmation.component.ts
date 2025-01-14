import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmationmodal',
  templateUrl: './modalconfirmation.component.html',
  styleUrls: ['./modalconfirmation.component.css'],
})
export class ConfirmationModalComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibimos los datos de la visita
  ) {}

  onClose(): void {
    this.dialogRef.close(); // Cierra el modal de confirmación
  }
}
