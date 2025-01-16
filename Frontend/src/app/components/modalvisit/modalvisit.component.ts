import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../services/workordercreate.service';
import { LoadingSpinerComponent } from '../loadingspiner/loadingspiner.component';
import { ConfirmationModalComponent } from '../../components/modalconfirmation/modalconfirmation.component';

@Component({
  selector: 'app-modalvisit',
  templateUrl: './modalvisit.component.html',
  styleUrls: ['./modalvisit.component.css'],
})
export class ModalVisitComponent {
  clientData: any;
  visitDetails: any;
  workOrder: any;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,  // Necesitamos el MatDialog para abrir el modal del spinner
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
    // Abre el modal de carga (spinner)
    const spinnerRef = this.dialog.open(LoadingSpinerComponent, {
      disableClose: true, // Deshabilita el cierre del modal al hacer clic fuera
    });

    // Llamada al servicio para crear la orden
    this.orderService.createOrder(this.workOrder).subscribe({
      next: response => {
        console.log('Orden de trabajo creada con éxito', response);
        
        // Cierra el spinner cuando la respuesta llega
        spinnerRef.close();
        
        // Abre el modal de confirmación con los datos de la visita
        this.dialog.open(ConfirmationModalComponent, {
          data: {
            message: 'La orden de trabajo ha sido creada correctamente.',
            clientData: this.clientData,
            visitDetails: this.visitDetails,
            selectedTime: this.data.selectedTime,  // Asumiendo que `selectedTime` es parte de los datos
          }
        });

        // Cierra el modal principal
        this.dialogRef.close();
      },
      error: error => {
        console.error('Error al crear la orden de trabajo', error);
        // Cierra el spinner si hay un error
        spinnerRef.close();
        
      }
    });
  }

  openSpinner() {
    this.dialog.open(LoadingSpinerComponent, {
      disableClose: true,
    });
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
