import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { MapComponent } from '../map/map.component';
import { AgendaComponent } from '../agenda/agenda.component';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-dashboardsup',
  standalone: true,
  imports: [NavbarComponent, MapComponent,AgendaComponent,CalendarComponent],
  templateUrl: './dashboardsup.component.html',
  styleUrl: './dashboardsup.component.css'
})
export class DashboardsupComponent {

}
