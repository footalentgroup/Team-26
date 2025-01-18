import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';  // Importa Router para la redirección

interface Client {
  _id: string;
  clientCompanyName: string;
  clientAddress: string;
  clientContactPerson: string;
  clientEmail: string;
  clientGeoLocation: {
    type: string;
    coordinates: number[];
  };

  clientPhone: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientApiResponse {
  ok: boolean;
  message: string;
  data: Client[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://ftg-team-26-backend-preview.vercel.app/clientbycompanyname';

  constructor(private http: HttpClient, private router: Router) {}

  getClients(query: string): Observable<ClientApiResponse> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No se encontró un token válido.'));
    }
  
    if (!query.trim()) {
      return throwError(() => new Error('El nombre de la empresa es obligatorio.'));
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}?clientCompanyName=${encodeURIComponent(query)}`;
    console.log('URL de búsqueda:', url); // Log para verificar la URL
  
    return this.http.get<ClientApiResponse>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error en la búsqueda de clientes:', error);
        if (error.status === 401) {
          alert('La sesión ha expirado. Por favor, inicia sesión de nuevo.');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}

