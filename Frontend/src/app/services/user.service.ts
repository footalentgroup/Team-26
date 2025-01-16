import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://ftg-team-26-backend-preview.vercel.app/api/user'; // URL base para las operaciones relacionadas con usuarios

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
  getUsers(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener un usuario por su ID
  getUserById(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para crear un usuario
  createUser(data: any): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post(url, data, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para actualizar un usuario (PATCH)
  updateUser(userId: string, data: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}`; // URL incluye el ID del usuario
    return this.http.patch(url, data, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para eliminar un usuario
  deleteUser(url: string): Observable<any> {
    const headers = this.getHeaders();
    const fullUrl = `${this.apiUrl}/${url}`; // Construye la URL completa
    return this.http.delete(fullUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores
  private handleError(error: any): Observable<never> {
    console.error('Error en la petición:', error);
    return throwError(() => new Error(error.message || 'Error en el servidor.'));
  }
}
