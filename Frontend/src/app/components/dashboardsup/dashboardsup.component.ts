import { Component } from '@angular/core';
import { NavbarsupComponent } from "../navbarsup/navbarsup.component";
import { CalendarComponent } from "../calendar/calendar.component";
import { MapComponent } from "../map/map.component";
import { AgendaComponent } from "../agenda/agenda.component";

@Component({
  selector: 'app-dashboardsup',
  standalone: true,
  imports: [NavbarsupComponent, CalendarComponent, MapComponent, AgendaComponent],
  templateUrl: './dashboardsup.component.html',
  styleUrl: './dashboardsup.component.css'
})
export class DashboardsupComponent {

}
