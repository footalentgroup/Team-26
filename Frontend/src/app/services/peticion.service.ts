import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {

public UrlHost:string= 'http://localhost:3001' 

  constructor(private http:HttpClient) { }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

    /*$$$$$$$$$$$$$$$$$$$$$ PETICIONES $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */


  Get(url: string) {
    const token = this.getToken(); // Obtener el token del localStorage
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    return this.http.get(url, { headers }).toPromise();
  }


  Post(url: string, payload: any) {
    const token = this.getToken(); // Obtener el token del localStorage
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
    return this.http.post(url, payload, { headers }).toPromise();
  }

  Patch(url: string, payload: any) {
    const token = localStorage.getItem("token");
    const headers = token
      ? new HttpHeaders().set("Authorization", `Bearer ${token}`)
      : new HttpHeaders();
  
    return this.http.patch(url, payload, { headers }).toPromise();
  }
}



