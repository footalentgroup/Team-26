import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateClientService {

 private apiUrl = 'https://ftg-team-26-backend-preview.vercel.app/client'; // URL base para las operaciones relacionadas con usuarios

  constructor(private http: HttpClient, private router: Router) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token válido.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

   // Método para obtener todos los usuarios
  getClient(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

   // Método para obtener un usuario por su ID
  getClientById(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

   // Método para crear un usuario
  createClient(data: any): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post(url, data, { headers: this.getHeaders() }).pipe(
    catchError(this.handleError)
    );
  }

   // Método para actualizar un Client (PATCH)
  updateClient(userId: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}`; // URL incluye el ID del usuario
    return this.http.patch(url, data, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

   // Método para eliminar un usuario
  deleteClient(userId: string): Observable<any> {
    const Url = `${this.apiUrl}/${userId}`; // Construye la URL completa
    return this.http.delete(Url, { headers:this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

   // Método para manejar errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la petición:', error);
  return throwError(() => new Error(error.message || 'Error en el servidor.'));
  }
}


