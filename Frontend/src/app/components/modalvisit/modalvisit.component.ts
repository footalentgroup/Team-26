import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-modalvisit',
  templateUrl: './modalvisit.component.html',
  styleUrls: ['./modalvisit.component.css'],
})
export class ModalVisitComponent {
  // Usamos un BehaviorSubject para manejar los datos dinámicamente
  dynamicContent$ = new BehaviorSubject<string>(this.data.content);

  constructor(
    public dialogRef: MatDialogRef<ModalVisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  updateContent(newContent: string): void {
    this.dynamicContent$.next(newContent);
  }

  close(): void {
    this.dialogRef.close();
  }
}
