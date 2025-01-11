// import { Component } from '@angular/core';
// import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { ModalVisitComponent } from '../modalvisit/modalvisit.component';
// import { ClientService } from '../../services/client.service';
// import { debounceTime, switchMap, catchError } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-calendar',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.css']
// })
// export class CalendarComponent {
//   clientControl = new FormControl('');  // Control para la entrada del cliente
//   clients: any[] = [];  // Lista de clientes filtrados
//   private dialogRef!: MatDialogRef<ModalVisitComponent>; 

//   constructor(private dialog: MatDialog, private clientService: ClientService) {
//     this.listenForClientInput();
//   }

//   listenForClientInput() {
//     this.clientControl.valueChanges
//       .pipe(
//         debounceTime(300),
//         switchMap(value =>
//           value && value.length > 2
//             ? this.clientService.getClients(value)
//             : of([])  // Devuelve un arreglo vacío si el input es insuficiente
//         ),
//         catchError(err => {
//           console.error('Error al buscar clientes:', err);
//           return of([]);  // Manejo de errores, retorna lista vacía
//         })
//       )
//       .subscribe(data => {
//         this.clients = data || [];
//       });
//   }

//   openModal() {
//     this.dialogRef = this.dialog.open(ModalVisitComponent, {
//       data: {
//         action: () => this.customAction(),
//       },
//     });

//     this.dialogRef.afterClosed().subscribe(() => {
//       console.log('El modal se cerró');
//     });
//   }

//   updateModalContent(newContent: string) {
//     if (this.dialogRef) {
//       this.dialogRef.componentInstance.updateContent(newContent);
//     }
//   }

//   customAction() {
//     this.updateModalContent('¡El contenido ha cambiado después de realizar la acción!');
//   }
// }
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalVisitComponent } from '../modalvisit/modalvisit.component';
import { ClientService } from '../../services/client.service';
import { debounceTime, switchMap, catchError, distinct, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';





@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,DropdownComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  clienttyping:string="";
  showclients:boolean=false;
  clients: string[] = [];  // Lista de clientes filtrados
  private dialogRef!: MatDialogRef<ModalVisitComponent>;
  private clientSubject=new Subject<string>()

  constructor(private dialog: MatDialog, private clientService: ClientService) {
    this.clientSubject.pipe(debounceTime(300),
    distinctUntilChanged()).
    subscribe(term=>{
      this.clientService.getClients(term).subscribe(results =>{
        this.clients=results.data.map(element=>element.clientCompanyName)
        this.showclients=true
      })
    }) 
  }
  
  clientChanges(value:string){
    this.clientSubject.next(value)
  }
   

  // selectClient(client: Client) {
  //   this.clientControl.setValue(client.clientCompanyName);  // Actualiza el campo de entrada con el nombre del cliente
  //   this.clients = [];  // Opcional: Vaciar la lista de clientes después de seleccionar uno
  // }

  // listenForClientInput() {
  //   this.clientControl.valueChanges
  //     .pipe(
  //       debounceTime(300),
  //       switchMap(value =>
  //         value && value.length > 2
  //           ? this.clientService.getClients(value)  // Asegúrate que el servicio retorne un Observable<ClientApiResponse>
  //           : of({ ok: true, message: '', data: [] })  // Devuelve un objeto vacío si el input es demasiado corto
  //       ),
  //       catchError(err => {
  //         console.error('Error al buscar clientes:', err);
  //         return of({ ok: false, message: 'Error', data: [] });  // En caso de error, retornamos un objeto con lista vacía
  //       })
  //     )
  //     .subscribe((response: ClientApiResponse) => {
  //       console.log('Clientes obtenidos desde el servicio:', response);
  //       this.clients = response.data || [];  // Asignamos los clientes desde la propiedad 'data' de la respuesta
  //     });
  // }
  

  openModal() {
    this.dialogRef = this.dialog.open(ModalVisitComponent, {
      data: {
        action: () => this.customAction(), // Acción personalizada para el modal
      },
    });

    this.dialogRef.afterClosed().subscribe(() => {
      console.log('El modal se cerró');
    });
  }

  updateModalContent(newContent: string) {
    if (this.dialogRef) {
      this.dialogRef.componentInstance.updateContent(newContent);  // Actualiza el contenido del modal
    }
  }

  customAction() {
    this.updateModalContent('¡El contenido ha cambiado después de realizar la acción!');  // Acción personalizada que se realiza
  }
}
