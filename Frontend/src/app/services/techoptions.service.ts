import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private apiUrl = 'http://localhost:3001/api/usertechnician';

  constructor(private http: HttpClient) {}

  getUsersByRole(role: string): Observable<any[]> {
    const token = localStorage.getItem('token');  // Recupera el token de localStorage

    if (!token) {
      console.error('Token no encontrado en localStorage');
      return throwError('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map((data) => {
        if (data && Array.isArray(data.data)) {
          // Filtra los usuarios por el rol pasado como parámetro
          return data.data.filter((user: any) => user.userRole === role); // Filtrado por el rol correcto
        } else {
          console.error('La respuesta no contiene un arreglo de técnicos o está mal estructurada.');
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error al obtener los usuarios:', error);
        return throwError(error);
      })
    );
  }
}
