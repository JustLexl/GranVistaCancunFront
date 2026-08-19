import { Routes } from '@angular/router';

export default [
    {
        path: 'GestionHabitaciones',
        data: { breadcrumb: 'Panel de Gestión de Habitaciones' },
        loadComponent: () => import('./gestion-habitaciones').then(c => c.GestionHabitacionesComponent)
    },
    {
        path: 'RegistroReservaciones',
        data: { breadcrumb: 'Registro de Reservaciones' },
        loadComponent: () => import('./registro-reservaciones').then(c => c.RegistroReservacionesComponent)
    },
    {
        path: 'RegistroHuespedes',
        data: { breadcrumb: 'Registro de Huéspedes' },
        loadComponent: () => import('./registro-huespedes').then(c => c.RegistroHuespedesComponent)
    },
    {
        path: 'ConsultarReservaciones',
        data: { breadcrumb: 'Consultar Reservaciones' },
        loadComponent: () => import('./consultar-reservaciones').then(c => c.ConsultarReservacionesComponent)
    },
    {
        path: 'CancelarReservacion',
        data: { breadcrumb: 'Cancelar Reservación' },
        loadComponent: () => import('./cancelar-reservacion').then(c => c.CancelarReservacionComponent)
    },
    {
        path: 'perfil',
        data: { breadcrumb: 'Perfil' },
        loadComponent: () => import('./perfil').then(c => c.Perfil)
    },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
