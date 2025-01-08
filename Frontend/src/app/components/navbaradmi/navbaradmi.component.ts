import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbaradmi',
  standalone: true,
  imports: [],
  templateUrl: './navbaradmi.component.html',
  styleUrl: './navbaradmi.component.css'
})
export class NavbaradmiComponent { 
  constructor(private router: Router){}
  userName: string = '';
  userRole: string = '';

  ngOnInit() {
    // Recuperar los datos desde el localStorage
    this.userName = localStorage.getItem('userName') || 'Usuario'; 
    this.userRole = localStorage.getItem('userRole') || '';
  }
  logout() {
    localStorage.removeItem("userName"); 
    this.router.navigate(['/login']); 
  }
}
