import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fcalendario',
  standalone: true,
  templateUrl: './fcalendario.component.html',
  styleUrls: ['./fcalendario.component.css'],
  imports: [FullCalendarModule, CommonModule],
})
export class FCalendarioComponent {
  @Input() currentDate: string = ''; // Recibe la fecha desde el componente padre
  @Output() selectedDateChange = new EventEmitter<string>(); // Emisor para enviar la fecha seleccionada

  selectedDate: string = ''; // Almacena la fecha seleccionada
  formattedDate: string = ''; // Fecha seleccionada en formato amigable

  // Configuración del calendario
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'es',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    titleFormat: {
      month: 'long',
      year: 'numeric',
    },
    footerToolbar: false,
    dateClick: (info: any) => this.handleDateClick(info),
  };

  handleDateClick(info: any): void {
    const selectedDate = info.dateStr;
    this.selectedDateChange.emit(selectedDate); // Emitir la fecha seleccionada
    this.selectedDate = selectedDate; // Actualizar la variable local
    this.formatDate(); // Formatear la fecha seleccionada
  }

  formatDate(): void {
    if (this.selectedDate) {
      const [year, month, day] = this.selectedDate.split('-');
      const date = new Date(+year, +month - 1, +day);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };

      const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);
      this.formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      this.currentDate = this.formattedDate; // Actualizar la fecha mostrada
    }
  }

  resetCalendar(): void {
    this.selectedDate = ''; // Limpia la fecha seleccionada
    this.formattedDate = ''; // Limpia la fecha formateada
    this.currentDate = ''; // Limpia la fecha actual
  }
}

