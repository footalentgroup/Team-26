
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkOrdersService {
  private apiUrl = 'https://localhost:3001/work-orders'; // Cambia esta URL por la de tu API

  constructor(private http: HttpClient) {}

  getWorkOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}