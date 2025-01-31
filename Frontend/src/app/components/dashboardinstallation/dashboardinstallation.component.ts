import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarsupComponent } from '../navbarsup/navbarsup.component';
import { InstallationComponent } from "../installation/installation.component";

@Component({
  selector: 'app-dashboardinstallation',
  standalone: true,
  imports: [RouterModule, NavbarsupComponent, InstallationComponent],
  templateUrl: './dashboardinstallation.component.html',
  styleUrl: './dashboardinstallation.component.css'
})
export class DashboardinstallationComponent {

}
