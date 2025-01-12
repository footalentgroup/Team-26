import { Routes } from '@angular/router';
import { DashboardadminComponent } from './components/dashboardadmin/dashboardadmin.component';
import { DashboardtecniComponent } from './components/dashboardtecni/dashboardtecni.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterAdminComponent } from './components/register-admin/register-admin.component';
import { MapComponent } from './map/map.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AgendaComponent } from './agenda/agenda.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardsupComponent } from './components/dashboardsup/dashboardsup.component';
import { NavbarsupComponent } from './components/navbarsup/navbarsup.component';

export const routes: Routes = [
    {path:"",component:LoginComponent,pathMatch:"full"},
    {path:"login",component:LoginComponent,pathMatch:"full"},
    {path:"dashboardadmin",component:DashboardadminComponent,pathMatch:"full"},
    {path:"dashboardtecni",component:DashboardtecniComponent,pathMatch:"full"},
    {path: "register-admin", component: RegisterAdminComponent }, 
    {path: "**", redirectTo: 'login' },
    {path:"",component:NavbarComponent, pathMatch:"full"},
    {path: "dashboardsup", component: DashboardsupComponent, pathMatch:"full" },
    {path: "navbarsup", component: NavbarsupComponent, pathMatch:"full" }, 
    {path: "map", component: MapComponent, pathMatch:"full" }, 
    {path: "agenda", component: AgendaComponent, pathMatch:"full" },
    {path: "calendar", component: CalendarComponent, pathMatch:"full" },  
];
