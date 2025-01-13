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
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalVisitComponent } from '../modalvisit/modalvisit.component';
import { ClientService } from '../../services/client.service';
import { debounceTime, switchMap, catchError, distinct, distinctUntilChanged } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ClientOption, DropdownComponent } from '../dropdown/dropdown.component';
import { TechnicianService } from '../../services/techoptions.service';
import { FCalendarioComponent } from '../fcalendario/fcalendario.component';






@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,DropdownComponent, FCalendarioComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'] ,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CalendarComponent {
  technicians: any[] = [];
  selectedTechnician: string = ''; 
  clienttyping: string = "";
  showclients: boolean = false;
  clientData: any = { name: 'Cliente XYZ', address: 'Dirección 123' };
  visitDetails: any = { visitType: '', time: '', technician: '' };
  clients: ClientOption[] = [];  // Cambiado a ClientOption[] en lugar de string[]

  private dialogRef!: MatDialogRef<ModalVisitComponent>;
  @Output() focused = new EventEmitter<void>();
  private clientSubject = new Subject<string>();

  constructor(
    private dialog: MatDialog, 
    private clientService: ClientService, 
    private techoptions: TechnicianService
  ) {}

  ngOnInit(): void {
    this.getTechnicians();
  }

  getTechnicians(): void {
    this.techoptions.getUsersByRole('technician').subscribe({
      next: (data) => {
        console.log(data);
        this.technicians = data.filter(user => user.userIsActive);
        console.log('Técnicos activos:', this.technicians);
      },
      error: (error) => {
        console.error('Error al obtener los técnicos:', error);
      }
    });

    // Lógica para obtener los clientes con debounce
    this.clientSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.clientService.getClients(term).subscribe({
        next: (results) => {
          // Aquí usamos ClientOption para mapear la respuesta
          this.clients = results.data.map(element => ({
            clientName: element.clientCompanyName,  // Usamos el nombre de la compañía
            clientAddress: element.clientAddress   // Usamos la dirección del cliente
          }));
          this.showclients = true;
        },
        error: (error) => {
          console.error('Error fetching clients:', error);
          this.showclients = false;
        }
      });
    });
  }
  handleClientSelection(client: ClientOption): void {
    this.clientData = {
      name: client.clientName,  // Solo el clientName se asigna aquí
      address: client.clientAddress
    };
    this.clienttyping = client.clientName; // Asigna solo el clientName al ngModel
  }
  

  // Función para manejar el cambio del cliente
  clientChanges(value: string): void {
    this.clientSubject.next(value);
  }

  onInputFocus(): void {
    this.showclients = true;
    this.focused.emit();
    if (!this.clienttyping) {
      this.clientSubject.next('');
    }
  }
  onTechnicianSelected(): void {
    // Buscar el técnico seleccionado por ID y asignar su nombre completo
    const selectedTech = this.technicians.find(technician => technician._id === this.selectedTechnician);
    if (selectedTech) {
      this.visitDetails.technician = selectedTech.userFullName;  // Asigna el nombre del técnico
    }
    console.log('Técnico seleccionado:', this.visitDetails.technician);
    console.log('visitDetails actualizado:', this.visitDetails);
  }
  
  openModal(): void {
    const dialogRef = this.dialog.open(ModalVisitComponent, {
      data: {
        clientData: this.clientData,
        visitDetails: this.visitDetails
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('Modal cerrado');
    });
  }
  
}

  
