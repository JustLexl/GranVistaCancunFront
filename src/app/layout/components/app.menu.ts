import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';

interface MenuItem {
    label: string;
    icon: string;
    routerLink: string[];
    roles?: string[];
    emails?: string[];
}

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
<nav class="flex-1 flex flex-col gap-1 px-2">
    @for (item of filteredModel(); track item.label) {
        <a
            [routerLink]="item.routerLink"
            routerLinkActive="active-nav-item"
            [routerLinkActiveOptions]="{ exact: false }"
            class="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer group">
            <span class="material-symbols-outlined text-xl leading-none">{{ item.icon }}</span>
            <span class="truncate">{{ item.label }}</span>
        </a>
    }
</nav>
<style>
    .nav-item { color: #404850; }
    .nav-item:hover { background: #f0f3ff; color: #005d90; }
    .active-nav-item { background: #e7eeff; color: #005d90; font-weight: 700; border-right: 3px solid #005d90; }
    .active-nav-item .material-symbols-outlined { font-variation-settings: 'FILL' 1; }
</style>
    `
})
export class AppMenu {
    model: MenuItem[] = [
        { label: 'Gestión de Habitaciones', icon: 'bed', routerLink: ['/Inicio/GestionHabitaciones'] },
        { label: 'Registro de reservaciones', icon: 'calendar_today', routerLink: ['/Inicio/RegistroReservaciones'] },
        { label: 'Registro de Huéspedes', icon: 'person_add', routerLink: ['/Inicio/RegistroHuespedes'] },
        { label: 'Consultar Reservaciones', icon: 'list_alt', routerLink: ['/Inicio/ConsultarReservaciones'] },
        { label: 'Cancelar Reservación', icon: 'cancel', routerLink: ['/Inicio/CancelarReservacion'] },
    ];

    filteredModel = computed(() => {
        const profile = this.authService.userProfile();
        const email = (profile?.email || this.authService.getCurrentUser()?.email || '').toLowerCase().trim();

        // Supervisor seguridad solo ve llaves, lost & found y proveedores
        if (email === 'supervisoresseguridad@nyxhotel.com' || email === 'supervisoresseguridad@nyxhotels.com') {
            return this.model.filter(i =>
                i.label === 'Control de Llaves' || i.label === 'Lost and Found' || i.label === 'Proveedores'
            );
        }

        return this.model.filter(item => {
            if (!item.emails) return true;
            return item.emails.includes(email);
        });
    });

    constructor(private authService: AuthService) {}
}
