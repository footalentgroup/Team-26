import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3001/api/workorder';  // URL del backend

  constructor(private http: HttpClient) { }

  // Método para crear una orden de trabajo con validación del token
  createOrder(orderData: any): Observable<any> {
    // Recupera el token desde el almacenamiento local (puedes cambiarlo si lo guardas en otro lugar)
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');  // Si no se encuentra el token, lanzar un error
    }

    // Configura las cabeceras para la solicitud, incluyendo el token de autorización
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Incluye el token en la cabecera Authorization
    });

    // Realiza la solicitud POST para crear la orden de trabajo
    return this.http.post<any>(this.apiUrl, orderData, { headers });
  }
}
