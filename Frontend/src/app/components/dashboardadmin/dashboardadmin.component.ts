import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MensajesComponent } from "../mensajes/mensajes.component";
import { NavbaradmiComponent } from "../navbaradmi/navbaradmi.component";
import { UsuariosComponent } from '../usuarios/usuarios.component';

@Component({
  selector: 'app-dashboardadmin',
  standalone: true,
  imports: [NavbaradmiComponent,UsuariosComponent],
  templateUrl: './dashboardadmin.component.html',
  styleUrl: './dashboardadmin.component.css'
})
export class DashboardadminComponent {
  userName: string = "ADMIN"; 
  constructor(private router: Router) {}

  ngOnInit() {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      this.userName = storedName;
    }
}
logout() {
  localStorage.removeItem("userName"); 
  this.router.navigate(['/login']); 
}
}

