import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalVisitComponent } from '../modalvisit/modalvisit.component';
import { ClientService } from '../../services/client.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ClientOption, DropdownComponent } from '../dropdown/dropdown.component';
import { TechnicianService } from '../../services/techoptions.service';
import { FCalendarioComponent } from '../fcalendario/fcalendario.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownComponent, FCalendarioComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CalendarComponent implements OnInit {
  currentDate: string = '';  // Variable para almacenar la fecha seleccionada
  technicians: any[] = [];
  selectedTechnician: string = '';
  clienttyping: string = '';
  showclients: boolean = false;
  clientData: any = { name: 'Cliente XYZ', address: 'Dirección 123', _id: '' };
  visitDetails: any = { visitType: '', time: '', technician: '' };
  clients: ClientOption[] = [];
  private clientSubject = new Subject<string>();
  @Output() focused = new EventEmitter<void>();


  selectedDate: string = '';
  selectedTime: string = '';
  workOrderSupervisor: string = '';
  private originalData: any;

  constructor(
    private dialog: MatDialog,
    private clientService: ClientService,
    private techoptions: TechnicianService
  ) {}

  ngOnInit(): void {
    this.getTechnicians();
    this.workOrderSupervisor = localStorage.getItem('userId') || '';  // Obtener el ID del supervisor desde localStorage
  }

  getTechnicians(): void {
    this.techoptions.getUsersByRole('technician').subscribe({
      next: (data) => {
        this.technicians = data.filter(user => user.userIsActive);
        console.log('Técnicos activos:', this.technicians);
      },
      error: (error) => {
        console.error('Error al obtener los técnicos:', error);
      }
    });
    this.handleClientSearch();
  }

  handleClientSearch(): void {
    this.clientSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(term => {
      this.clientService.getClients(term).subscribe({
        next: (results) => {
          this.clients = results.data.map(element => ({
            clientName: element.clientCompanyName,
            Address: element.clientAddress,
            _id: element._id,
            clientContactPerson: element.clientContactPerson || '',
            clientEmail: element.clientEmail || '',
            clientPhone: element.clientPhone || '',
            clientGeoLocation: element.clientGeoLocation || { type: 'Point', coordinates: [] }
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
    console.log('Datos del cliente:', client);
    this.clientData = {
      name: client.clientName,
      address: client.Address,
      _id: client._id,
      clientContactPerson: client.clientContactPerson,
      clientEmail: client.clientEmail,
      clientPhone: client.clientPhone,
      clientGeoLocation: client.clientGeoLocation,
    };
    this.clienttyping = client.clientName;
  }

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
    const selectedTech = this.technicians.find(tech => tech._id === this.selectedTechnician);
    if (selectedTech) {
      this.visitDetails.technician = selectedTech.userFullName;
    }
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
  }

  onTimeSelected(time: string): void {
    this.selectedTime = time;
  }

  openModal(): void {
    if (!this.selectedDate || !this.selectedTime || !this.clientData._id || !this.selectedTechnician) {
      console.error('Faltan datos necesarios: fecha, hora, cliente o técnico.');
      return;
    }

    const workOrderScheduledDate = `${this.selectedDate}T${this.selectedTime}:00.000+00:00`;

    const workOrder = {
      workOrderSupervisor: this.workOrderSupervisor,
      clientId: this.clientData._id,
      workOrderDescription: 'Solicitud del cliente',
      serviceType: this.visitDetails.visitType,
      workOrderScheduledDate: workOrderScheduledDate,
      workOrderAssignedTechnician: this.selectedTechnician,
      workOrderLocation: {
        type: 'Point',
        coordinates: this.clientData.clientGeoLocation?.coordinates || []
      },
      workOrderClientContactPerson: this.clientData.clientContactPerson,
      workOrderclientEmail: this.clientData.clientEmail,
      workOrderAddress: this.clientData.address
    };

    this.originalData = {
      clientData: { ...this.clientData },
      visitDetails: { ...this.visitDetails },
      selectedDate: this.selectedDate,
      selectedTime: this.selectedTime,
      selectedTechnician: this.selectedTechnician
    };

    const dialogRef = this.dialog.open(ModalVisitComponent, {
      data: {
        clientData: this.clientData,
        visitDetails: this.visitDetails,
        selectedTime: this.selectedTime,
        workOrder: workOrder,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Si el resultado es 'edit', significa que se desea conservar los cambios
      if (result == 'edit') {
        // Los datos no se restablecen, se mantienen como están
        console.log('Datos editados con éxito');
      } else {
        // Restablecer los valores a los datos originales si no se editó
        this.resetForm();
      }
    });
    
  }

  resetForm(): void {
    console.log("datos vacios")
    this.clienttyping = "";
    this.visitDetails = { visitType: "", time: "", technician: "" };
    this.currentDate = "";
    this.selectedDate = "";
    this.selectedTime = "";
    this.selectedTechnician = "";
  }
}