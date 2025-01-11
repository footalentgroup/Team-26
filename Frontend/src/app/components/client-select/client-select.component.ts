import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-client-select',
  templateUrl: './client-select.component.html',
  styleUrls: ['./client-select.component.css']
})
export class ClientSelectComponent {
  clientControl = new FormControl('');
  client: any[] = [];

  constructor(private clientService: ClientService) {
    this.clientControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => 
          value && value.length > 2 
            ? this.clientService.getClients(value)
            : of([])  // Retorna lista vacía si no hay suficientes caracteres
        ),
        catchError(err => {
          console.error('Error al obtener clientes:', err);
          return of([]);  // Maneja errores devolviendo lista vacía
        })
      )
      .subscribe(data => {
        this.client = data || [];
      });
  }
}
