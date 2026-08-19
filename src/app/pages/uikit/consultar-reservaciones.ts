import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Reservacion {
    nombre: string;
    initials: string;
    habitacion: string;
    tipoHabitacion: string;
    fechaEntrada: string;
    fechaSalida: string;
    estado: 'Confirmada' | 'En curso' | 'Finalizada';
}

@Component({
    selector: 'app-consultar-reservaciones',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
<div class="w-full relative min-h-screen pb-12">
    <!-- Background Layer styling -->
    <div class="fixed inset-0 z-[-1] bg-image opacity-30"></div>
    <div class="fixed inset-0 z-[-1] bg-surface-container-lowest/70 backdrop-blur-sm"></div>

    <!-- Main Canvas -->
    <main class="relative z-10 p-8">
        <div class="max-w-[1400px] mx-auto flex flex-col gap-6">
            
            <!-- Page Header & Filters -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel p-6 rounded-xl">
                <div>
                    <h2 class="text-3xl font-bold text-on-background tracking-tight">Consultar Reservaciones</h2>
                    <p class="text-on-surface-variant mt-1 text-sm">Gestione y revise el estado de las estancias.</p>
                </div>
                
                <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <!-- Date Filter -->
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">calendar_today</span>
                        <input 
                            type="date"
                            [(ngModel)]="filtroFecha"
                            (change)="filtrarReservaciones()"
                            class="pl-9 pr-3 py-2 bg-white/50 border border-outline-variant rounded-lg text-sm focus:border-primary outline-none h-10 min-w-[150px]" />
                    </div>

                    <!-- Type Filter -->
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">filter_list</span>
                        <select 
                            [(ngModel)]="filtroTipo"
                            (change)="filtrarReservaciones()"
                            class="pl-9 pr-8 py-2 bg-white/50 border border-outline-variant rounded-lg text-sm focus:border-primary outline-none appearance-none h-10 min-w-[150px]">
                            <option value="">Todos los tipos</option>
                            <option value="Suite Ocean View">Suite Ocean View</option>
                            <option value="Standard King">Standard King</option>
                            <option value="Deluxe Double">Deluxe Double</option>
                            <option value="Doble Superior">Doble Superior</option>
                            <option value="Suite Ejecutiva">Suite Ejecutiva</option>
                            <option value="Individual">Individual</option>
                            <option value="Junior Suite">Junior Suite</option>
                        </select>
                    </div>

                    <!-- Search Input -->
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                        <input 
                            type="text"
                            [(ngModel)]="searchQuery"
                            (input)="filtrarReservaciones()"
                            placeholder="Buscar huésped o hab..."
                            class="pl-9 pr-3 py-2 bg-white/50 border border-outline-variant rounded-lg text-sm focus:border-primary outline-none h-10 min-w-[180px]" />
                    </div>

                    <button 
                        (click)="limpiarFiltros()"
                        class="bg-primary text-on-primary px-4 h-10 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer">
                        <span class="material-symbols-outlined text-[18px]">refresh</span>
                        Limpiar
                    </button>
                </div>
            </div>

            <!-- Data Table Card -->
            <div class="glass-panel rounded-xl flex flex-col overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-surface-container/50 border-b border-outline-variant/30">
                                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nombre del huésped</th>
                                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Número de habitación</th>
                                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fecha de entrada</th>
                                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fecha de salida</th>
                                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Estado</th>
                                <th class="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-outline-variant/20">
                            <tr *ngFor="let res of reservacionesFiltradas" class="hover:bg-white/40 transition-colors group">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                                            {{ res.initials }}
                                        </div>
                                        <span class="font-medium text-on-background">{{ res.nombre }}</span>
                                    </div>
                                </td>
                                <td class="p-4 text-on-surface-variant">
                                    {{ res.habitacion }} - {{ res.tipoHabitacion }}
                                </td>
                                <td class="p-4 text-on-surface-variant">
                                    {{ formatFecha(res.fechaEntrada) }}
                                </td>
                                <td class="p-4 text-on-surface-variant">
                                    {{ formatFecha(res.fechaSalida) }}
                                </td>
                                <td class="p-4">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border" [class]="getEstadoClasses(res.estado)">
                                        {{ res.estado }}
                                    </span>
                                </td>
                                <td class="p-4 text-right">
                                    <button class="text-primary hover:text-primary-container p-1 rounded-full hover:bg-primary/10 transition-colors cursor-pointer">
                                        <span class="material-symbols-outlined text-[20px]">more_vert</span>
                                    </button>
                                </td>
                            </tr>
                            <tr *ngIf="reservacionesFiltradas.length === 0">
                                <td colspan="6" class="p-12 text-center text-on-surface-variant">
                                    <span class="material-symbols-outlined text-4xl block mb-2 text-outline">search_off</span>
                                    No se encontraron reservaciones con los criterios de búsqueda.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="mt-auto p-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container/30">
                    <span class="text-sm text-on-surface-variant">
                        Mostrando {{ reservacionesFiltradas.length }} de {{ reservaciones.length }} reservaciones
                    </span>
                    <div class="flex gap-2">
                        <button class="p-1 rounded bg-white/50 border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
                            <span class="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button class="p-1 rounded bg-white/50 border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container transition-colors">
                            <span class="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </main>
</div>
`,
    styles: [`
        :host { display: block; width: 100%; }
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 8px 32px 0 rgba(0, 119, 182, 0.05);
        }
        .bg-image {
            background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAbDg4GeD84yRkKwUwoqy30kG_vwax5W1YA4HFgvQSqEwPHHDCQemPe5TYBaJFJVVPp8Nwu90W1QQfutkhbNq4Ok8G2VixGMLC2Ia9hizm44P-FKXAVxkF1r0RKGhetwpaBgA2y-7uj6q9oEcYpvjTCtLd2quv3ZAMNMXNVQb9_c7kL5EdrgNbPR6c4qS9CDRbd98hxx5KiUGVQDaQA9Ro69DOpp5MUh3kTGUafoLNGIdaaaj1FyIJSNs6qLJ05XfaWSQ');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }
    `]
})
export class ConsultarReservacionesComponent implements OnInit {

    reservaciones: Reservacion[] = [];
    reservacionesFiltradas: Reservacion[] = [];

    // Filter properties
    filtroFecha = '';
    filtroTipo = '';
    searchQuery = '';

    ngOnInit() {
        this.cargarReservaciones();
    }

    cargarReservaciones() {
        // Load default mockup ones from user requested design
        const defaultReservations: Reservacion[] = [
            { nombre: 'Alejandro Espinosa', initials: 'AE', habitacion: '402', tipoHabitacion: 'Suite Ocean View', fechaEntrada: '2023-10-24', fechaSalida: '2023-10-28', estado: 'Confirmada' },
            { nombre: 'Maria Rodriguez', initials: 'MR', habitacion: '105', tipoHabitacion: 'Standard King', fechaEntrada: '2023-10-22', fechaSalida: '2023-10-26', estado: 'En curso' },
            { nombre: 'John Smith', initials: 'JS', habitacion: '214', tipoHabitacion: 'Deluxe Double', fechaEntrada: '2023-10-20', fechaSalida: '2023-10-23', estado: 'Finalizada' },
            { nombre: 'Carlos Vargas', initials: 'CV', habitacion: '301', tipoHabitacion: 'Suite Ocean View', fechaEntrada: '2023-10-27', fechaSalida: '2023-11-02', estado: 'Confirmada' }
        ];

        // Also dynamically load any check-ins from localStorage room list!
        const habitacionesLocales = localStorage.getItem('hotel_habitaciones_v2');
        const dynamicReservations: Reservacion[] = [];

        if (habitacionesLocales) {
            const list: any[] = JSON.parse(habitacionesLocales);
            list.forEach(room => {
                if (room.estado === 'Ocupada' && room.huesped) {
                    // Generate Initials
                    const names = room.huesped.trim().split(' ');
                    let initials = 'G';
                    if (names.length > 0) initials = names[0].charAt(0).toUpperCase();
                    if (names.length > 1) initials += names[names.length - 1].charAt(0).toUpperCase();

                    dynamicReservations.push({
                        nombre: room.huesped,
                        initials: initials,
                        habitacion: room.numero,
                        tipoHabitacion: room.tipo,
                        fechaEntrada: room.checkin || new Date().toISOString().split('T')[0],
                        fechaSalida: room.checkout || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                        estado: 'En curso'
                    });
                }
            });
        }

        // Combine both lists (dynamic active ones first!)
        this.reservaciones = [...dynamicReservations, ...defaultReservations];
        this.filtrarReservaciones();
    }

    filtrarReservaciones() {
        let list = [...this.reservaciones];

        // Apply type filter
        if (this.filtroTipo) {
            list = list.filter(r => r.tipoHabitacion === this.filtroTipo);
        }

        // Apply date filter (matches if check-in or check-out date is equal or contains it)
        if (this.filtroFecha) {
            list = list.filter(r => r.fechaEntrada === this.filtroFecha || r.fechaSalida === this.filtroFecha);
        }

        // Apply text query search
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase();
            list = list.filter(r => 
                r.nombre.toLowerCase().includes(q) || 
                r.habitacion.includes(q) ||
                r.tipoHabitacion.toLowerCase().includes(q)
            );
        }

        this.reservacionesFiltradas = list;
    }

    limpiarFiltros() {
        this.filtroFecha = '';
        this.filtroTipo = '';
        this.searchQuery = '';
        this.filtrarReservaciones();
    }

    getEstadoClasses(estado: string): string {
        switch (estado) {
            case 'Confirmada':
                return 'bg-secondary/10 text-secondary border-secondary/20';
            case 'En curso':
                return 'bg-primary-container/20 text-primary border-primary/20';
            case 'Finalizada':
                return 'bg-outline-variant/30 text-on-surface-variant border-outline-variant/50';
            default:
                return 'bg-surface-variant text-on-surface-variant border-outline-variant/30';
        }
    }

    formatFecha(fechaStr: string): string {
        if (!fechaStr) return '';
        const parts = fechaStr.split('-');
        if (parts.length !== 3) return fechaStr;
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const año = parts[0];
        const mesIdx = parseInt(parts[1]) - 1;
        const día = parts[2];
        return `${día} ${meses[mesIdx]}, ${año}`;
    }
}
