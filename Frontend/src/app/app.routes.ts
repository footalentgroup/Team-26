import { Routes } from '@angular/router';
import { DashboardadminComponent } from './components/dashboardadmin/dashboardadmin.component';
import { DashboardtecniComponent } from './components/dashboardtecni/dashboardtecni.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { PantallacargaComponent } from './components/pantallacarga/pantallacarga.component';
import { RecuperarpasswordComponent } from './components/recuperarpassword/recuperarpassword.component';
import { HomeComponent } from './components/home/home.component';
import { AccesibilidadComponent } from './components/accesibilidad/accesibilidad.component';
import { FormcontactoComponent } from './components/formcontacto/formcontacto.component';


export const routes: Routes = [
    {path:"",component:HomeComponent,pathMatch:"full"},
    {path:"login",component:LoginComponent,pathMatch:"full"},
    {path:"accesibilidad",component:AccesibilidadComponent,pathMatch:"full"},
    {path:"dashboardadmin",component:DashboardadminComponent,pathMatch:"full"},
    {path:"dashboardtecni",component:DashboardtecniComponent,pathMatch:"full"},
    {path:"pantallacarga",component:PantallacargaComponent,pathMatch:"full"},
    {path:"formcontacto",component:FormcontactoComponent,pathMatch:"full"},
    {path:"recuperarpassword",component:RecuperarpasswordComponent,pathMatch:"full"},
    {path: "register-admin", component: RegisterAdminComponent }, 
    {path: "**", redirectTo: 'login' } 
];
