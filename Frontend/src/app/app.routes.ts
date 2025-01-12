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

import { DashboardsupComponent } from './components/dashboardsup/dashboardsup.component';
import { NavbarsupComponent } from './components/navbarsup/navbarsup.component';
import { MapComponent } from './components/map/map.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ModalVisitComponent } from './components/modalvisit/modalvisit.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ScreenEditarComponent } from './components/screen-editar/screen-editar.component';




export const routes: Routes = [
    {path:"",component:HomeComponent,pathMatch:"full"},
    {path:"login",component:LoginComponent,pathMatch:"full"},
    {path:"accesibilidad",component:AccesibilidadComponent,pathMatch:"full"},
    {path:"dashboardadmin",component:DashboardadminComponent,pathMatch:"full"},
    {path:"dashboardtecni",component:DashboardtecniComponent,pathMatch:"full"},
    {path:"dropdown",component:DropdownComponent,pathMatch:"full"},
    {path:"usuarios",component:UsuariosComponent,pathMatch:"full"},
    {path:"screenEditar",component:ScreenEditarComponent,pathMatch:"full"},

    {path:"pantallacarga",component:PantallacargaComponent,pathMatch:"full"},
    {path:"formcontacto",component:FormcontactoComponent,pathMatch:"full"},
    {path:"recuperarpassword",component:RecuperarpasswordComponent,pathMatch:"full"},
    {path: "register-admin", component: RegisterAdminComponent }, 

    {path: "dashboardsup", component: DashboardsupComponent },
    {path: "navbarsup", component: NavbarsupComponent }, 
    {path: "map", component: MapComponent }, 
    {path: "agenda", component: AgendaComponent },
    {path: "calendar", component: CalendarComponent },
    {path: "modalvisit", component: ModalVisitComponent },  



    {path: "**", redirectTo: 'login' } 
];
