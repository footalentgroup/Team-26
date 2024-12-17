import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }
  datamensajes: any[] = []

  Load(color:string, mensaje:string){
    this.datamensajes.push({
      color:color,
      mensaje:mensaje
    })
    console.log('Mensajes actuales:', this.datamensajes); 
    setTimeout(()=>{
      this.datamensajes.splice(0,1)
    },3000)
  }
}
