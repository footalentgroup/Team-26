import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cuentaactiv',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './cuentaactiv.component.html',
  styleUrl: './cuentaactiv.component.css'
})
export class CuentaactivComponent implements OnInit{

  password: string = "";
  newpassword: string = "";
  confipassword: string = "";
  

  showPassword1: boolean = false;
  showPassword2: boolean = false;
  showPassword3: boolean = false;

  mostrarModal: boolean = false;
  errorMessage: string = ''; // Mensaje de error para validaciones

  token:string="";


  constructor(private router: Router, private userService: UserService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Capturar el token desde la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    console.log('Token:', this.token);
  }

    /*$$$$$$$$$$$$$$$$$$ MÉTODO PARA ALTERNAR LA VISIBILIDAD DE LA CONTRASEÑA $$$$$$$$$$$$$$$$$$$$$$$*/
    togglePasswordVisibility(field: number): void {
      if (field === 1) {
          this.showPassword1 = !this.showPassword1;
      } else if (field === 2) {
          this.showPassword2 = !this.showPassword2;
      } else if (field === 3) {
          this.showPassword3 = !this.showPassword3;
      }
  }
  Confirm(): void {
    // Validar que las contraseñas coincidan
    if (this.newpassword !== this.confipassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
  
    // Validar longitud de la nueva contraseña
    if (this.newpassword.length < 4 || this.newpassword.length > 30) {
      this.errorMessage = 'La contraseña debe tener entre 4 y 30 caracteres.';
      return;
    }
  
    // Obtener el correo del usuario antes de enviar la nueva contraseña
    this.userService.getUserByToken(this.token).subscribe(
      (response: any) => {
        console.log("token22222",this.token)
        if (response.ok) {
          
          const userEmail = response.data.userEmail; // Extraer el correo del usuario
          console.log("email",response.data.userEmail)
  
          //Enviar la nueva contraseña junto con el correo al backend
          this.userService.confirmUser(this.token, this.newpassword, userEmail).subscribe(
            (response: any) => {
              if (response.ok) {
                // Mostrar modal de confirmación y redirigir al login
                this.mostrarModal = true; // Mostrar modal
              } else {
                this.errorMessage = 'Hubo un problema al actualizar la contraseña.';
              }
            },
            (error) => {
              console.error(error);
              this.errorMessage = 'Error al procesar la solicitud. Intente nuevamente.';
            }
          );
        } else {
          this.errorMessage = 'No se pudo obtener la información del usuario.';
        }
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error al obtener la información del usuario. Intente nuevamente.';
    }
  );
  }
  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

}
