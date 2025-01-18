import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Asegúrate de importar `of` para retornar un Observable vacío en caso de error

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://ftg-team-26-backend-preview.vercel.app/workorder';  // URL del backend

  constructor(private http: HttpClient) { }

  // Método para crear una orden de trabajo con validación del token
  createOrder(orderData: any): Observable<any> {
    // Recupera el token desde el almacenamiento local (puedes cambiarlo si lo guardas en otro lugar)
    const token = localStorage.getItem('token');
    console.log(localStorage.getItem('token'));

    if (!token) {
      console.error('No se encontró el token');  
      return of({ error: 'No token provided' });  // Respuesta clara en el Observable
    }

    // Recuperar el ID del supervisor desde el localStorage
    const supervisorId = localStorage.getItem('userId');  // Asegúrate de que 'userId' sea el nombre correcto en tu localStorage

    if (!supervisorId) {
      console.error('No se encontró el ID del supervisor en el localStorage');
      return of();  // Devuelve un Observable vacío si no se encuentra el ID
    }

    // Asignar el ID del supervisor al objeto orderData
    orderData.workOrderSupervisor = supervisorId;

    // Asegúrate de que los IDs sean cadenas
    orderData.clientId = String(orderData.clientId);
    orderData.workOrderAssignedTechnician = String(orderData.workOrderAssignedTechnician);

    // Asegúrate de que la fecha esté en el formato correcto
    orderData.workOrderScheduledDate = new Date(orderData.workOrderScheduledDate).toISOString();

    console.log('Datos de la orden de trabajo antes de enviarlos:', orderData);

        // Configura las cabeceras para la solicitud, incluyendo el token de autorización
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Incluye el token en la cabecera Authorization
        });


    // // Configura las cabeceras para la solicitud, incluyendo el token de autorización
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${token}`  // Incluye el token en la cabecera Authorization
    // });

    // Realiza la solicitud POST para crear la orden de trabajo
    return this.http.post<any>(this.apiUrl, orderData, { headers });
  }
}
