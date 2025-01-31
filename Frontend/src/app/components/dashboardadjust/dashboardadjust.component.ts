import { Component } from '@angular/core';
import { NavbarsupComponent } from '../navbarsup/navbarsup.component';
import { AdjustComponent } from '../adjust/adjust.component';

@Component({
  selector: 'app-dashboardadjust',
  standalone: true,
  imports: [NavbarsupComponent, AdjustComponent],
  templateUrl: './dashboardadjust.component.html',
  styleUrl: './dashboardadjust.component.css'
})
export class DashboardadjustComponent {

}
