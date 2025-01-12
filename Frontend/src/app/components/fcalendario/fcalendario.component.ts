import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // Asegúrate de importar FullCalendarModule
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Importar el plugin de interacción

@Component({
  selector: 'fcalendario', // Cambia el selector
  standalone: true,
  templateUrl: './fcalendario.component.html', // Asegúrate de actualizar este nombre si cambias el archivo HTML
  styleUrls: ['./fcalendario.component.css'], // Asegúrate de actualizar este nombre si cambias el archivo CSS
  imports: [FullCalendarModule], // Aquí es donde estamos importando el módulo FullCalendar
})
export class FCalendarioComponent { // Cambia el nombre de la clase
  currentDate: string = ''; // Variable para almacenar la fecha seleccionada
  selectedDate: string = ''; // Variable para almacenar la fecha seleccionada del calendario en formato 'YYYY-MM-DD'
  formattedDate: string = ''; // Variable para almacenar la fecha formateada

  // Configuración del calendario
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin], // Añadir el plugin de interacción
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth',
    },
    dateClick: (info: any) => this.handleDateClick(info), // Cambiar a 'any' para evitar el error de tipo
  };

  // Manejo del evento dateClick
  handleDateClick(info: any): void {
    // Obtener la fecha seleccionada
    this.selectedDate = info.dateStr;

    // Llamar a la función para formatear la fecha seleccionada
    this.formatDate();
  }

  // Función para formatear la fecha seleccionada
  formatDate() {
    if (this.selectedDate) {
      // Crear la fecha a partir del valor de 'selectedDate', que es una cadena con formato 'YYYY-MM-DD'
      const [year, month, day] = this.selectedDate.split('-');
      const date = new Date(+year, +month - 1, +day); // Month es 0-indexed, por eso restamos 1

      // Opciones para formatear la fecha
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // Nombre completo del día de la semana (por ejemplo, "lunes")
        day: 'numeric',  // Día del mes (por ejemplo, "6")
        month: 'long',   // Nombre completo del mes (por ejemplo, "enero")
        year: 'numeric', // Año completo (por ejemplo, "2025")
      };

      // Formatear la fecha con Intl.DateTimeFormat
      this.formattedDate = date.toLocaleDateString('es-ES', options); // Utiliza las opciones de formateo y la configuración local 'es-ES'

      // Asignar el resultado al currentDate para mostrarlo en la vista
      this.currentDate = `Fecha seleccionada: ${this.formattedDate}`;
    }
  }
}
