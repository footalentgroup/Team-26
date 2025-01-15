import { Component, Output, EventEmitter } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 

@Component({
  selector: 'fcalendario',
  standalone: true,
  templateUrl: './fcalendario.component.html',
  styleUrls: ['./fcalendario.component.css'],
  imports: [FullCalendarModule],
})
export class FCalendarioComponent {
  @Output() selectedDateChange = new EventEmitter<string>(); // Emisor para enviar la fecha al componente principal

  currentDate: string = ''; // Variable para almacenar la fecha seleccionada
  selectedDate: string = ''; // Variable para almacenar la fecha seleccionada del calendario en formato 'YYYY-MM-DD'
  formattedDate: string = ''; // Variable para almacenar la fecha formateada

  // Configuración del calendario
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: "es",
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next', 
      center: 'title',
      right: ''
    },
    titleFormat: { 
      month: 'long',  
      year: 'numeric' 
    },
    footerToolbar: false,  
    dateClick: (info: any) => this.handleDateClick(info),
  };

  handleDateClick(info: any): void {
    const selectedDate = info.dateStr;
    this.selectedDateChange.emit(selectedDate);  // Emitir la fecha seleccionada correctamente
    console.log('Fecha emitida:', selectedDate);
  
    // Actualizar la variable en el componente actual
    this.selectedDate = selectedDate;  // Actualizamos la variable para reflejar el cambio
    this.formatDate();  // Mantén tu lógica de formato
  }

  // Función para formatear la fecha seleccionada
  formatDate() {
    if (this.selectedDate) {
      const [year, month, day] = this.selectedDate.split('-');
      const date = new Date(+year, +month - 1, +day); 

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };

      const formatDate = (date: Date) => {
        const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);
        return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      };

      this.formattedDate = formatDate(date); 
      
      this.currentDate = this.formattedDate; // Actualizar la fecha mostrada

    }
  }
}
