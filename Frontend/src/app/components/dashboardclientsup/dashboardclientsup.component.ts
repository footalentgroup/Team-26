import { Component } from '@angular/core';
import { NavbarsupComponent } from '../navbarsup/navbarsup.component';
import { ClientsupComponent } from '../clientsup/clientsup.component';

@Component({
  selector: 'app-dashboardclientsup',
  standalone: true,
  imports: [NavbarsupComponent, ClientsupComponent],
  templateUrl: './dashboardclientsup.component.html',
  styleUrl: './dashboardclientsup.component.css'
})
export class DashboardclientsupComponent {

}
