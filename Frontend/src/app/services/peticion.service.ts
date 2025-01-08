import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {

public UrlHost:string= 'https://ftg-team-26-backend-preview.vercel.app' 

  constructor(private http:HttpClient) { }

    /*$$$$$$$$$$$$$$$$$$$$$ PETICIONES $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

Post(url:string, payload:{}){
  let promise = new Promise((resolve, reject) => {

    this.http.post(url,payload)
    .toPromise()
    .then((res:any) => {
      resolve(res)
    }).catch((error:any) => {
      reject(error)
    })
  })
  return promise
}
Get(url:string){ 

  let promise = new Promise((resolve, reject)=>{

    this.http.get(url)
    .toPromise()
    .then((res:any)=>{
      console.log(res)
      resolve(res)
    }).catch((error:any)=>{
      reject(error)
    })
  })
  return promise
}

}
