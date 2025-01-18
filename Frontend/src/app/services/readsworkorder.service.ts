import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface workorder {
  clientCompanyName: string;
  serviceType: string;
  date: string;
  time: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkOrdersService {
  private apiUrl = 'https://ftg-team-26-backend-preview.vercel.app/api/workordersforweek/'; // Cambia esta URL por la de tu API

  constructor(private http: HttpClient) {}

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Los meses van de 0 a 11
    const day = today.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // Método para obtener las órdenes de trabajo, usando el token del localStorage
  getWorkOrders(): Observable<any[]> {
    // Obtén el token del localStorage
    const token = localStorage.getItem('token');
    
    // Crea los encabezados, agregando el token si existe
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const dateString = this.getCurrentDate()

    // Realiza la solicitud HTTP con los encabezados
    return this.http.get<any[]>(`${this.apiUrl}${dateString}`, { headers });
  }
}
