import { Component, OnInit } from '@angular/core';
import { WorkOrdersService } from '../../services/readsworkorder.service';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AgendaComponent,
      multi: true,
    },
  ],
})
export class AgendaComponent implements OnInit, ControlValueAccessor {
  workOrders: any[] = []; // Variable para almacenar las órdenes de trabajo

  constructor(private workOrdersService: WorkOrdersService) {}

  // Implementación de OnInit
  ngOnInit(): void {
    this.fetchWorkOrders(); // Llamar al método para obtener datos
  }

  // Método para obtener las órdenes de trabajo desde el servicio
  fetchWorkOrders(): void {
    this.workOrdersService.getWorkOrders().subscribe({
      next: (data) => {
        this.workOrders = data.map((order: any) => ({
          clientCompanyName: order.clientCompanyName, // Asegúrate que esto esté en la respuesta
          serviceType: order.serviceType,
          date: order.date,
          time: order.time,
        }));
      },
      error: (err) => {
        console.error('Error al obtener las órdenes de trabajo:', err);
      },
    });
  }

  // Métodos de ControlValueAccessor
  writeValue(obj: any): void {
    if (obj) {
      this.workOrders = obj;
    }
  }

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {}
}
