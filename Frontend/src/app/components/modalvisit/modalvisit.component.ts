// import { CommonModule } from '@angular/common';
// import { Component, Inject, Input, Output, EventEmitter, NgModule, forwardRef } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { BehaviorSubject } from 'rxjs';
// import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';



// @Component({
//   selector: 'app-modalvisit',
//   standalone: true,
//   imports: [FormsModule,CommonModule, ReactiveFormsModule],
//   templateUrl: './modalvisit.component.html',
//   styleUrl: './modalvisit.component.css',


// providers: [
//   {
//     provide: NG_VALUE_ACCESSOR,
//     useExisting: forwardRef(() => ModalVisitComponent),
//     multi: true,
//   }
// ]
// })


// export class ModalVisitComponent implements ControlValueAccessor{




//   clientData: any;
//   visitDetails: any;
//   technicians: string[] = ['Técnico 1', 'Técnico 2', 'Técnico 3']; // Ejemplo de técnicos
//   isEditable: boolean = false; // Controla si los campos son editables

//   constructor(
//     public dialogRef: MatDialogRef<ModalVisitComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {
//     this.clientData = data.clientData; // Datos del cliente recibidos
//     this.visitDetails = data.visitDetails; // Detalles de la visita recibidos
//   }
//   writeValue(obj: any): void {
//     throw new Error('Method not implemented.');
//   }
//   registerOnChange(fn: any): void {
//     throw new Error('Method not implemented.');
//   }
//   registerOnTouched(fn: any): void {
//     throw new Error('Method not implemented.');
//   }
//   setDisabledState?(isDisabled: boolean): void {
//     throw new Error('Method not implemented.');
//   }

//   // Activa la edición de los campos
//   enableEdit(): void {
//     this.isEditable = true;
//   }

//   // Método para cerrar el modal
//   close(): void {
//     this.dialogRef.close();
//   }

//   // Método para enviar los datos al padre
//   submitForm(): void {
//     const updatedData = {
//       clientName: this.clientData.name,
//       address: this.clientData.address,
//       visitType: this.visitDetails.visitType,
//       time: this.visitDetails.time,
//       technician: this.visitDetails.technician,
//     };

//     // Emitir los datos al componente padre, o realizar otras acciones
//     this.dialogRef.close(updatedData);
//   }
// }
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../../services/workordercreate.service';

@Component({
  selector: 'app-modalvisit',
  templateUrl: './modalvisit.component.html',
  styleUrls: ['./modalvisit.component.css']
})
export class ModalVisitComponent {
  clientData: any;
  visitDetails: any;
  workOrder: any;

  constructor(
    private orderService: OrderService,
    private dialogRef: MatDialogRef<ModalVisitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientData = data.clientData;
    this.visitDetails = data.visitDetails;
    this.workOrder = data.workOrder;
  }

  ngOnInit(): void {
    console.log('Orden de trabajo recibida:', this.workOrder);
  }

  // Crear la orden de trabajo
  createWorkOrder() {
    this.orderService.createOrder(this.workOrder).subscribe(
      response => {
        console.log('Orden de trabajo creada con éxito', response);
      },
      error => {
        console.error('Error al crear la orden de trabajo', error);
      }
    );
  }

  // Cerrar manteniendo los datos (editar)
  onEdit(): void {
    this.dialogRef.close('edit');  // Indica que los datos deben mantenerse
  }

  // Cerrar restableciendo valores
  onCloseReset(): void {
    this.dialogRef.close();  // Indica que los datos deben restablecerse
  }
}
