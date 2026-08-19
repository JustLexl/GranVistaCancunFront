import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReservacionCancelable {
    id: string;
    nombre: string;
    initials: string;
    habitacion: string;
    tipoHabitacion: string;
    fechaEntrada: string;
    fechaSalida: string;
    estado: 'Confirmada' | 'En curso' | 'Finalizada';
    tarifa: number;
    huespedesText: string;
    isDynamic?: boolean; // dynamic from localStorage
}

@Component({
    selector: 'app-cancelar-reservacion',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
<div class="w-full relative min-h-screen pb-12">
    <!-- Background Image -->
    <div class="fixed inset-0 z-[-1]">
        <div class="bg-cover bg-center w-full h-full opacity-30 filter blur-sm bg-image"></div>
        <div class="absolute inset-0 bg-background/80 mix-blend-overlay"></div>
    </div>

    <!-- Main Content Area -->
    <main class="relative z-10 p-8">
        <div class="max-w-4xl mx-auto flex flex-col gap-6">
            
            <header class="mb-4">
                <h2 class="text-3xl font-bold text-primary mb-1">Cancelar Reservación</h2>
                <p class="text-sm text-on-surface-variant">Busque y confirme la cancelación de una reserva existente.</p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                <!-- Search Section -->
                <div class="col-span-12 glass-panel rounded-xl p-6 shadow-sm">
                    <div class="flex flex-col md:flex-row gap-4 items-end">
                        <div class="flex-1 w-full">
                            <label class="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider" for="search-reservation">Buscar Reservación</label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                                <input 
                                    [(ngModel)]="searchId"
                                    (keyup.enter)="buscar()"
                                    class="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                                    id="search-reservation" 
                                    placeholder="Nombre del huésped o ID de reservación (ej. HGV-2049, 402)" 
                                    type="text" />
                            </div>
                        </div>
                        <button 
                            (click)="buscar()"
                            class="bg-primary hover:bg-surface-tint text-on-primary text-sm font-bold px-6 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-2 h-[42px] cursor-pointer">
                            Buscar
                        </button>
                    </div>
                </div>

                <!-- Reservation Details Card -->
                <div *ngIf="reservacionEncontrada" class="col-span-12 glass-panel rounded-xl p-6 shadow-sm border-l-4 border-l-primary animate-fade-in">
                    <h3 class="text-lg font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/30 flex justify-between items-center">
                        Detalles de la Reservación
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" [class]="getEstadoClass(reservacionEncontrada.estado)">
                            {{ reservacionEncontrada.estado }}
                        </span>
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Huésped Principal</p>
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-base">
                                    {{ reservacionEncontrada.initials }}
                                </div>
                                <div>
                                    <p class="text-base font-bold text-on-surface m-0">{{ reservacionEncontrada.nombre }}</p>
                                    <p class="text-xs text-on-surface-variant m-0">ID: {{ reservacionEncontrada.id }}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 bg-surface/50 p-4 rounded-lg">
                            <div>
                                <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Check-in</p>
                                <p class="text-sm text-on-surface font-semibold flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[18px] text-outline">login</span>
                                    {{ formatFecha(reservacionEncontrada.fechaEntrada) }}
                                </p>
                            </div>
                            <div>
                                <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Check-out</p>
                                <p class="text-sm text-on-surface font-semibold flex items-center gap-1">
                                    <span class="material-symbols-outlined text-[18px] text-outline">logout</span>
                                    {{ formatFecha(reservacionEncontrada.fechaSalida) }}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                        <div>
                            <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Habitación</p>
                            <p class="text-sm text-on-surface font-semibold">{{ reservacionEncontrada.habitacion }} - {{ reservacionEncontrada.tipoHabitacion }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Huéspedes</p>
                            <p class="text-sm text-on-surface">{{ reservacionEncontrada.huespedesText }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tarifa Total</p>
                            <p class="text-sm text-on-surface font-bold text-primary">\${{ reservacionEncontrada.tarifa }} USD</p>
                        </div>
                    </div>
                </div>

                <!-- Not Found Alert -->
                <div *ngIf="buscarIntentado && !reservacionEncontrada" class="col-span-12 glass-panel rounded-xl p-8 text-center animate-fade-in shadow-sm">
                    <span class="material-symbols-outlined text-4xl text-error mb-2 block">error</span>
                    <h4 class="text-base font-bold text-on-surface">Reservación no encontrada</h4>
                    <p class="text-sm text-on-surface-variant mt-1">Verifique el ID o nombre del huésped e intente nuevamente.</p>
                </div>

                <!-- Cancellation Action Section -->
                <div *ngIf="reservacionEncontrada" class="col-span-12 glass-panel rounded-xl p-6 border border-error-container bg-error-container/20 animate-fade-in">
                    <div class="flex items-start gap-4 mb-6">
                        <div class="bg-error-container text-on-error-container p-2 rounded-full flex-shrink-0">
                            <span class="material-symbols-outlined">warning</span>
                        </div>
                        <div>
                            <h4 class="text-base font-bold text-on-error-container mb-1">Advertencia de Cancelación</h4>
                            <p class="text-sm text-on-surface">
                                Al cancelar esta reservación, la habitación <strong>{{ reservacionEncontrada.habitacion }} - {{ reservacionEncontrada.tipoHabitacion }}</strong> volverá a estar disponible para nuevos huéspedes inmediatamente. Las políticas de reembolso aplicables se procesarán según los términos de la tarifa.
                            </p>
                            <div class="mt-4">
                                <label class="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider" for="cancellation-reason">Motivo de cancelación (Opcional)</label>
                                <select 
                                    [(ngModel)]="motivoCancelacion"
                                    class="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                                    id="cancellation-reason">
                                    <option value="">Seleccionar motivo...</option>
                                    <option value="Solicitud del huésped">Solicitud del huésped</option>
                                    <option value="Error en la reserva">Error en la reserva</option>
                                    <option value="Fuerza mayor">Fuerza mayor</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-error-container/30">
                        <button 
                            (click)="descartar()"
                            class="bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer">
                            Mantener Reservación
                        </button>
                        <button 
                            (click)="cancelarReservacion()"
                            class="bg-error hover:bg-[#93000a] text-on-error text-sm font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                            <span class="material-symbols-outlined text-[20px]">cancel</span>
                            Confirmar Cancelación
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<!-- Toast notification -->
<div *ngIf="toastMsg" class="fixed bottom-6 right-6 z-[99999] bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
    <span class="material-symbols-outlined text-sm" [class]="toastSuccess ? 'text-secondary-container' : 'text-error-container'">
        check_circle
    </span>
    {{ toastMsg }}
</div>
`,
    styles: [`
        :host { display: block; width: 100%; }
        .glass-panel {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .bg-image {
            background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1xIP2jUhjUOOxzyXmOMRbQVEcOJYbulQs1JIx_o0Zj7peq7lb0xxO1gqvIP3oJJqdchHtK7mMhCLx0rSZQI7S8zrs4qc3W13JoCWaiHPBODhyL6Ywz0pm5qKkyYW1kTKyowIpgCB9Ms_zUGI6EQuSoEiykL7gbmwTnAuDJhnenHXSxeBwURK5BZXQ3BiIe_byK_rHiO8gIbeQGDw3Tmc8IK4KJSjg0SD7QyNRwPIWGpTD40kIOYUIj0MJohbhgStUiw');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in  { animation: fadeIn 0.3s ease-out forwards; }
    `]
})
export class CancelarReservacionComponent implements OnInit {

    reservacionesMock: ReservacionCancelable[] = [
        { id: 'HGV-2049', nombre: 'Maria Carmen Silva', initials: 'MC', habitacion: '402', tipoHabitacion: 'Ocean View Suite', fechaEntrada: '2023-10-15', fechaSalida: '2023-10-20', estado: 'Confirmada', tarifa: 1250, huespedesText: '2 Adultos, 0 Niños' }
    ];

    searchId = 'HGV-2049';
    buscarIntentado = false;
    reservacionEncontrada: ReservacionCancelable | null = null;
    motivoCancelacion = '';

    toastMsg = '';
    toastSuccess = true;
    private toastTimer: any;

    ngOnInit() {
        // Automatically search default mock on startup
        this.buscar();
    }

    buscar() {
        this.buscarIntentado = true;
        const q = this.searchId.trim().toLowerCase();
        if (!q) {
            this.reservacionEncontrada = null;
            return;
        }

        // 1. Search in static mock
        let found = this.reservacionesMock.find(r => 
            r.id.toLowerCase() === q || 
            r.nombre.toLowerCase().includes(q) || 
            r.habitacion === q
        );

        // 2. If not found, search in dynamic rooms from localStorage
        if (!found) {
            const storedRooms = localStorage.getItem('hotel_habitaciones_v2');
            if (storedRooms) {
                const list: any[] = JSON.parse(storedRooms);
                const room = list.find(r => 
                    r.estado === 'Ocupada' && 
                    (r.numero === q || (r.huesped && r.huesped.toLowerCase().includes(q)))
                );
                
                if (room) {
                    const initials = room.huesped.trim().split(' ').map((n: string) => n.charAt(0).toUpperCase()).join('').substring(0, 2);
                    found = {
                        id: `HGV-${room.numero}`,
                        nombre: room.huesped,
                        initials: initials || 'G',
                        habitacion: room.numero,
                        tipoHabitacion: room.tipo,
                        fechaEntrada: room.checkin || new Date().toISOString().split('T')[0],
                        fechaSalida: room.checkout || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                        estado: 'Confirmada',
                        tarifa: room.precio * 5, // mock estimation
                        huespedesText: '2 Adultos, 0 Niños',
                        isDynamic: true
                    };
                }
            }
        }

        this.reservacionEncontrada = found || null;
    }

    getEstadoClass(estado: string): string {
        switch (estado) {
            case 'Confirmada': return 'bg-secondary-container text-on-secondary-container';
            case 'En curso': return 'bg-primary-container text-on-primary-container';
            default: return 'bg-surface-container-high text-on-surface-variant';
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
        return `${día} ${meses[mesIdx]} ${año}`;
    }

    descartar() {
        this.reservacionEncontrada = null;
        this.searchId = '';
        this.buscarIntentado = false;
        this.showToast('Acción cancelada. Se conservó la reservación.');
    }

    cancelarReservacion() {
        if (!this.reservacionEncontrada) return;

        const id = this.reservacionEncontrada.id;
        const nombre = this.reservacionEncontrada.nombre;
        const habitacionNum = this.reservacionEncontrada.habitacion;

        // If it is dynamic (from localStorage), set the room back to "Disponible" or "Limpieza"
        if (this.reservacionEncontrada.isDynamic) {
            const storedRooms = localStorage.getItem('hotel_habitaciones_v2');
            if (storedRooms) {
                const list: any[] = JSON.parse(storedRooms);
                const index = list.findIndex(r => r.numero === habitacionNum);
                if (index !== -1) {
                    list[index].estado = 'Disponible';
                    list[index].huesped = null;
                    list[index].checkin = null;
                    list[index].checkout = null;
                    list[index].notas = 'Reservación cancelada: ' + (this.motivoCancelacion || 'Solicitud del huésped');
                    localStorage.setItem('hotel_habitaciones_v2', JSON.stringify(list));
                }
            }
        }

        this.showToast(`Reservación ${id} de ${nombre} cancelada con éxito.`);
        this.reservacionEncontrada = null;
        this.searchId = '';
        this.buscarIntentado = false;
        this.motivoCancelacion = '';
    }

    private showToast(msg: string, success = true) {
        clearTimeout(this.toastTimer);
        this.toastMsg = msg;
        this.toastSuccess = success;
        this.toastTimer = setTimeout(() => {
            this.toastMsg = '';
        }, 3000);
    }
}
