import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {

public UrlHost:string= 'http://localhost:3001' 

  constructor(private http:HttpClient) { }

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

  
  /* $$$$$$$$$$$$$$$$$$$ PETICIONES PARA LOGIN -LOGOUT$$$$$$$$$$$$$$$$$$$ */

  Postwithouttoken(url: string, payload: any): Observable<any> {
    return this.http.post(url, payload).pipe(
      tap(response => console.log('Respuesta POST sin token exitosa:', response)),
      catchError(error => this.handleError(error))
    );
  }
  Getwithouttoken(url: string): Observable<any> {
    return this.http.get(url).pipe(
      tap(response => console.log('Respuesta POST sin token exitosa:', response)),
      catchError(error => this.handleError(error))
    );
  }

  Patch(url: string, payload: any): Observable<any> {
    
    return this.http.patch(url, payload, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }


  /* $$$$$$$$$$$$$$$$$$$ FUNCIONES UTILITARIAS $$$$$$$$$$$$$$$$$$$ */

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error en la petición:', error);
    return throwError(() => new Error(error.message || 'Error en la petición HTTP.'));
}
}





