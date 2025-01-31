import { Routes } from '@angular/router';
import { DashboardadminComponent } from './components/dashboardadmin/dashboardadmin.component';
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
import { ClientesComponent } from './components/clientes/clientes.component';
import { FCalendarioComponent } from './components/fcalendario/fcalendario.component';
import { LoadingSpinerComponent } from './components/loadingspiner/loadingspiner.component';
import { ConfirmationModalComponent } from './components/modalconfirmation/modalconfirmation.component';
import { CuentaactivComponent } from './components/cuentaactiv/cuentaactiv.component';
import { DashboardinstallationComponent } from './components/dashboardinstallation/dashboardinstallation.component';
import { InstallationComponent } from './components/installation/installation.component';
import { DashboardclientsupComponent } from './components/dashboardclientsup/dashboardclientsup.component';
import { ClientsupComponent } from './components/clientsup/clientsup.component';
import { DashboardadjustComponent } from './components/dashboardadjust/dashboardadjust.component';
import { AdjustComponent } from './components/adjust/adjust.component';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { autenticacionGuard } from './services/autenticacion-rutas.service';
import { AdjustadminComponent } from './components/adjustadmin/adjustadmin.component';







export const routes: Routes = [
    {path:"",component:HomeComponent,pathMatch:"full"},
    {path:"login",component:LoginComponent,pathMatch:"full"},
    {path:"accesibilidad",component:AccesibilidadComponent,pathMatch:"full"},

    {path:"dashboardadmin",component:DashboardadminComponent,
        canActivate: [autenticacionGuard],
        children: [ 
            { path: "usuarios", component: UsuariosComponent },
            { path: "clientes", component: ClientesComponent },
            { path: "", redirectTo: "usuarios", pathMatch: "full" }, 
            ],
        },
    { path: "", redirectTo: "dashboardadmin", pathMatch: "full" },


    {path:"dropdown",component:DropdownComponent,pathMatch:"full"},
    {path:"error-modal",component:ErrorModalComponent,pathMatch:"full"},


    {path:"usuarios",component:UsuariosComponent,pathMatch:"full"},
    {path:"loadingspiner",component:LoadingSpinerComponent,pathMatch:"full"},
    {path:"modalconfirmation",component:ConfirmationModalComponent,pathMatch:"full"},
    {path:"dashboardclientsup",component:DashboardclientsupComponent,pathMatch:"full"},
    {path:"clientsup",component:ClientsupComponent,pathMatch:"full"},


    {path:"pantallacarga",component:PantallacargaComponent,pathMatch:"full"},
    {path:"cuentaactiv",component:CuentaactivComponent,pathMatch:"full"},
    {path:"formcontacto",component:FormcontactoComponent,pathMatch:"full"},
    {path:"recuperarpassword",component:RecuperarpasswordComponent,pathMatch:"full"},
    {path:"adjustadmin",component:AdjustadminComponent,canActivate: [autenticacionGuard],pathMatch:"full"},
    {path:"dashboardadjust",component:DashboardadjustComponent,canActivate: [autenticacionGuard],pathMatch:"full"},
    {path:"adjust",component:AdjustComponent,pathMatch:"full"},
    {path: "dashboardsup", component: DashboardsupComponent },
    {path:"dropdown",component:DropdownComponent,pathMatch:"full"},
    {path:"usuarios",component:UsuariosComponent,pathMatch:"full"},
    {path:"loadingspiner",component:LoadingSpinerComponent,pathMatch:"full"},
    {path:"modalconfirmation",component:ConfirmationModalComponent,pathMatch:"full"},
    {path:"pantallacarga",component:PantallacargaComponent,canActivate: [autenticacionGuard],pathMatch:"full"},
    {path:"cuentaactiv",component:CuentaactivComponent,pathMatch:"full"},
    {path:"formcontacto",component:FormcontactoComponent,pathMatch:"full"},
    {path:"recuperarpassword",component:RecuperarpasswordComponent,pathMatch:"full"},
    {path: "dashboardsup", component: DashboardsupComponent,canActivate: [autenticacionGuard] },

    {path: "navbarsup", component: NavbarsupComponent }, 
    {path: "map", component: MapComponent }, 
    {path: "agenda", component: AgendaComponent },
    {path: "calendar", component: CalendarComponent },
    {path: "modalvisit", component: ModalVisitComponent },  
    {path: "register-admin", component: RegisterAdminComponent ,pathMatch:"full"},  
    {path: "map", component: MapComponent ,pathMatch:"full"}, 
    {path: "agenda", component: AgendaComponent,pathMatch:"full" },
    {path: "calendar", component: CalendarComponent,pathMatch:"full" },
    {path: "modalvisit", component: ModalVisitComponent,pathMatch:"full" },  

    {path: "fcalendario", component: FCalendarioComponent,pathMatch:"full" }, 
    {path: "dashboardinstallation", component: DashboardinstallationComponent,pathMatch:"full" },
    {path: "installation", component: InstallationComponent,pathMatch:"full"} ,



    {path: "fcalendario", component: FCalendarioComponent,pathMatch:"full" },  

    {path: "**", redirectTo: 'login' } 
];
