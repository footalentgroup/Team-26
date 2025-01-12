import { Component } from '@angular/core';
import { MensajesService } from '../../services/mensajes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.css'
})
export class MensajesComponent {
  constructor(public msg:MensajesService){}

}
