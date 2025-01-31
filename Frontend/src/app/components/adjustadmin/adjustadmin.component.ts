import { Component } from '@angular/core';
import { AdjustComponent } from "../adjust/adjust.component";
import { NavbaradmiComponent } from '../navbaradmi/navbaradmi.component';

@Component({
  selector: 'app-adjustadmin',
  standalone: true,
  imports: [AdjustComponent,NavbaradmiComponent],
  templateUrl: './adjustadmin.component.html',
  styleUrl: './adjustadmin.component.css'
})
export class AdjustadminComponent {

}
