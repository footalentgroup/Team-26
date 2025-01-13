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
  clientData: any = { name: 'Cliente XYZ', address: 'Dirección 123', _id: '' };  // Asegúrate de que _id esté vacío al principio
  visitDetails: any = { visitType: '', time: '', technician: '' };
  clients: ClientOption[] = [];
  private clientSubject = new Subject<string>();
  @Output() focused = new EventEmitter<void>();

  selectedDate: string = '';  // Fecha seleccionada del calendario
  selectedTime: string = '';  // Hora seleccionada del 'select'
  workOrderSupervisor: string = '';  // ID del supervisor que está haciendo la solicitud

  constructor(
    private dialog: MatDialog,
    private clientService: ClientService,
    private techoptions: TechnicianService
  ) {}

  ngOnInit(): void {
    this.getTechnicians();
    this.workOrderSupervisor = localStorage.getItem('userId') || '';  // Obtener el ID del supervisor desde localStorage
  }

  // Obtener lista de técnicos activos
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

  // Manejar búsqueda de clientes con debounce
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
            _id: element._id,  // Asegúrate de incluir el _id en la respuesta
            clientContactPerson: element.clientContactPerson || '',  // Asignar persona de contacto
            clientEmail: element.clientEmail || '',  // Asignar correo electrónico
            clientPhone: element.clientPhone || '',  // Asignar teléfono
            clientGeoLocation: element.clientGeoLocation || { type: 'Point', coordinates: [] }  // Asignar geolocalización
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

  // Asignación del cliente seleccionado
  handleClientSelection(client: ClientOption): void {
    console.log('Datos del cliente:', client);  // Verifica si clientGeoLocation está presente
  if (client.clientGeoLocation) {
    console.log('Coordenadas del cliente:', client.clientGeoLocation.coordinates);
  } else {
    console.error('No se encontró la geolocalización del cliente.');
  }
    this.clientData = {
      name: client.clientName,
      address: client.Address,
      _id: client._id,
      clientContactPerson: client.clientContactPerson,  // Asegúrate de incluir estos campos
      clientEmail: client.clientEmail,
      clientPhone: client.clientPhone,
      clientGeoLocation: client.clientGeoLocation,
    };
    this.clienttyping = client.clientName;
    console.log('Cliente seleccionado:', this.clientData);  // Verifica que el _id esté asignado correctamente
  }

  // Emisión de cambios del cliente ingresado
  clientChanges(value: string): void {
    this.clientSubject.next(value);
  }

  // Mostrar lista de clientes al enfocarse en el input
  onInputFocus(): void {
    this.showclients = true;
    this.focused.emit();
    if (!this.clienttyping) {
      this.clientSubject.next('');
    }
  }

  // Asignación del técnico seleccionado
  onTechnicianSelected(): void {
    const selectedTech = this.technicians.find(tech => tech._id === this.selectedTechnician);
    if (selectedTech) {
      this.visitDetails.technician = selectedTech.userFullName;
    }
    console.log('Técnico seleccionado:', this.visitDetails.technician);
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    console.log('Fecha seleccionada desde calendario:', this.selectedDate);
  }

  onTimeSelected(time: string): void {
    console.log('Método onTimeSelected llamado');
    this.selectedTime = time;
    console.log('Hora seleccionada:', this.selectedTime);
  }

  // Apertura del modal para confirmar agendamiento
  openModal(): void {
      // Log para revisar el estado actual de clientData
  console.log('Datos del cliente:', this.clientData);
    // Asegúrate de que los datos estén correctamente asignados
    console.log('Datos previos:');
    console.log('Fecha seleccionada:', this.selectedDate);
    console.log('Hora seleccionada:', this.selectedTime);
    console.log('ID del cliente:', this.clientData._id);  // Verifica que el _id esté presente
    console.log('Técnico seleccionado:', this.selectedTechnician);
  
    // Comprobar que tanto la fecha, la hora, el cliente y el técnico estén correctamente seleccionados
    if (!this.selectedDate || !this.selectedTime || !this.clientData._id || !this.selectedTechnician) {
      console.error('Faltan datos necesarios: fecha, hora, cliente o técnico.');
      return;
    }
  
    // Verificar las coordenadas del cliente
    const clientGeoLocation = this.clientData.clientGeoLocation;
    console.log('clientGeoLocation:', clientGeoLocation);  // Verifica cómo luce el objeto completo
    const coordinates = clientGeoLocation?.coordinates;
    
    if (!coordinates || coordinates.length < 2) {
      console.error('Las coordenadas del cliente no están disponibles o son incorrectas.');
      return;
    }
  
    console.log('Coordenadas:', coordinates);  // Verifica las coordenadas antes de usarlas
  
    // Crear la fecha completa combinando la fecha seleccionada en el calendario con la hora
    const workOrderScheduledDate = `${this.selectedDate}T${this.selectedTime}:00.000+00:00`;
  
    // Crear la orden de trabajo con los datos proporcionados
    const workOrder = {
      workOrderSupervisor: this.workOrderSupervisor,  // ID del supervisor
      clientId: this.clientData._id,  // ID del cliente
      workOrderDescription: 'Solicitud del cliente',
      serviceType: this.visitDetails.visitType,
      workOrderScheduledDate: workOrderScheduledDate,
      workOrderAssignedTechnician: this.selectedTechnician,
      workOrderLocation: {
        type: 'Point',
        coordinates: this.clientData.clientGeoLocation.coordinates  // Asegúrate de copiar las coordenadas correctamente
      },
      workOrderClientContactPerson: this.clientData.clientContactPerson,  // Asignar el contacto
      workOrderclientEmail: this.clientData.clientEmail,  // Asignar el correo electrónico
      workOrderAddress: this.clientData.address  // Asegúrate de que la dirección esté asignada correctamente
    };
  
    console.log('Datos de la orden de trabajo:', workOrder);  // Imprimir para verificar
  
    // Abrir el modal y pasarle los datos
    const dialogRef = this.dialog.open(ModalVisitComponent, {
      data: {
        clientData: this.clientData,
        visitDetails: this.visitDetails,
        selectedTime: this.selectedTime,
        workOrder: workOrder,  // Pasamos la orden de trabajo
      }
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('Modal cerrado');
    });
  }
}  