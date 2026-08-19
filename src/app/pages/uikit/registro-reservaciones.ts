import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Huesped {
    id: string;
    nombre: string;
    tipo: string;
    initials: string;
}

interface RoomMock {
    numero: string;
    tipo: string;
    estado: 'Disponible' | 'Requiere Limpieza' | 'Ocupada';
    precio: number;
}

@Component({
    selector: 'app-registro-reservaciones',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
<div class="relative min-h-screen pb-12">
    <!-- Background Layer -->
    <div class="fixed inset-0 z-[-1] bg-image opacity-30"></div>
    <div class="fixed inset-0 z-[-1] bg-surface-container-lowest/70 backdrop-blur-sm"></div>

    <!-- Main Content -->
    <main class="relative z-10 p-8">
        <div class="max-w-4xl mx-auto space-y-6">
            
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-3xl font-bold text-primary mb-2 tracking-tight">Crear Reservación</h2>
                    <p class="text-on-surface-variant text-base">Completa los datos del huésped y asigna una habitación.</p>
                </div>
            </div>

            <!-- Guest Selection -->
            <section class="glass-panel rounded-xl p-6">
                <h2 class="text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span class="material-symbols-outlined">person_search</span>
                    Selección de Huésped
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Buscar Huésped</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-2.5 text-outline">search</span>
                            <input 
                                type="text"
                                [(ngModel)]="searchHuesped"
                                (input)="filtrarHuespedes()"
                                class="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface" 
                                placeholder="Buscar por nombre..." />
                        </div>
                        
                        <!-- Autocomplete / Results dropdown -->
                        <div *ngIf="searchHuesped && filteredHuespedes.length > 0" class="mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-h-48 overflow-y-auto absolute z-50 w-72">
                            <div 
                                *ngFor="let h of filteredHuespedes" 
                                (click)="selectHuesped(h)"
                                class="px-4 py-2 hover:bg-surface-container-low cursor-pointer text-sm text-on-surface border-b border-outline-variant/30 last:border-0">
                                {{ h.nombre }} ({{ h.tipo }})
                            </div>
                        </div>
                    </div>

                    <div class="flex items-end">
                        <div class="bg-surface-container-low p-3 rounded-lg w-full flex items-center gap-3 border border-outline-variant">
                            <div class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                                {{ selectedHuesped.initials }}
                            </div>
                            <div>
                                <p class="text-sm font-semibold m-0 text-on-surface">{{ selectedHuesped.nombre }}</p>
                                <p class="text-xs text-on-surface-variant m-0">{{ selectedHuesped.tipo }} • ID: {{ selectedHuesped.id }}</p>
                            </div>
                            <button (click)="nuevoHuesped()" class="ml-auto text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors cursor-pointer" title="Cambiar / Editar">
                                <span class="material-symbols-outlined text-sm">edit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Dates -->
            <section class="glass-panel rounded-xl p-6">
                <h2 class="text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span class="material-symbols-outlined">calendar_month</span>
                    Fechas de Estadía
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Fecha de Entrada</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-2 text-outline text-base">event_upcoming</span>
                            <input 
                                type="date"
                                [(ngModel)]="fechaEntrada"
                                (change)="calcularNoches()"
                                class="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Fecha de Salida</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-2 text-outline text-base">event_available</span>
                            <input 
                                type="date"
                                [(ngModel)]="fechaSalida"
                                (change)="calcularNoches()"
                                class="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary text-sm text-on-surface" />
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 text-right">
                    <span class="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        {{ noches }} {{ noches === 1 ? 'Noche' : 'Noches' }}
                    </span>
                </div>
            </section>

            <!-- Room Selection -->
            <section class="glass-panel rounded-xl p-6">
                <h2 class="text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
                    <span class="material-symbols-outlined">meeting_room</span>
                    Selección de Habitación
                </h2>
                
                <div class="flex gap-4 mb-4">
                    <select 
                        [(ngModel)]="filtroCategoria"
                        (change)="filtrarHabitaciones()"
                        class="rounded-lg border border-outline-variant bg-surface py-2 px-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                        <option value="">Todas las Categorías</option>
                        <option value="Suite Vista al Mar">Suite Vista al Mar</option>
                        <option value="Doble Estándar">Doble Estándar</option>
                        <option value="Suite Panorámica">Suite Panorámica</option>
                        <option value="Junior Suite">Junior Suite</option>
                    </select>

                    <select 
                        [(ngModel)]="filtroPlanta"
                        (change)="filtrarHabitaciones()"
                        class="rounded-lg border border-outline-variant bg-surface py-2 px-3 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                        <option value="">Cualquier Planta</option>
                        <option value="baja">Planta Baja (1-2)</option>
                        <option value="alta">Planta Alta (3-5)</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                        *ngFor="let room of filteredRooms"
                        (click)="room.estado !== 'Ocupada' && selectRoom(room)"
                        [class]="getRoomCardClass(room)"
                        class="border rounded-xl p-4 cursor-pointer relative overflow-hidden transition-all hover:shadow-md">
                        
                        <div *ngIf="selectedRoomNumber === room.numero" class="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                            Seleccionada
                        </div>

                        <h3 class="text-lg font-bold m-0" [class.text-primary]="selectedRoomNumber === room.numero">Hab. {{ room.numero }}</h3>
                        <p class="text-xs text-on-surface-variant m-0 mb-2">{{ room.tipo }}</p>

                        <!-- Status info -->
                        <div class="flex items-center gap-1 mb-2">
                            <span class="material-symbols-outlined text-sm" [class]="getRoomStatusColor(room.estado)">
                                {{ room.estado === 'Disponible' ? 'check_circle' : room.estado === 'Requiere Limpieza' ? 'cleaning_services' : 'cancel' }}
                            </span>
                            <span class="text-xs font-semibold" [class]="getRoomStatusColor(room.estado)">
                                {{ room.estado }}
                            </span>
                        </div>

                        <div class="text-lg font-bold text-on-surface">
                            \${{ room.precio }}<span class="text-xs font-normal text-on-surface-variant">/noche</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Action Bar -->
            <div class="flex justify-end gap-4 pt-4">
                <button 
                    (click)="resetForm()"
                    class="px-5 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-sm font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">
                    Cancelar
                </button>
                <button 
                    (click)="guardarReservacion()"
                    class="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-bold hover:bg-primary/90 shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">save</span>
                    Guardar Reservación
                </button>
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
            box-shadow: 0 8px 32px 0 rgba(0, 119, 182, 0.05);
        }
        .bg-image {
            background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuABqJ_rjST64aLn0mo0kGmjGGcC_OoID0NSVQ0qw_4bbHfQfeuWKsBARv_ulDS9dpIfyyRFcL8-7OxLsUhNnnji8KHJ1pGu1W3TSeo_ZXWry81Bhzq1v1q8SuE1ljDCxNOaE9dWNCR9YLSe-DBXls7sPlFdeLRg_4kVv8x8At8s-wJeqvrP-mPETQMI9E_J9e56V11DcO--RkA2groYHMjHz6t4aCWCHDs1h2hAO5ibuMDK5_jNqUCaiBSv7vASoba3Zg');
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
export class RegistroReservacionesComponent implements OnInit {

    huespedesList: Huesped[] = [
        { id: 'G-8472', nombre: 'Carlos Mendoza', tipo: 'VIP', initials: 'CM' },
        { id: 'G-1024', nombre: 'Alejandro Gomez', tipo: 'Regular', initials: 'AG' },
        { id: 'G-2309', nombre: 'María Rodríguez', tipo: 'Frecuente', initials: 'MR' },
        { id: 'G-9844', nombre: 'Lucía Fernández', tipo: 'VIP', initials: 'LF' },
    ];

    roomsList: RoomMock[] = [
        { numero: '402', tipo: 'Suite Vista al Mar', estado: 'Disponible', precio: 350 },
        { numero: '405', tipo: 'Suite Vista al Mar', estado: 'Requiere Limpieza', precio: 350 },
        { numero: '510', tipo: 'Suite Panorámica', estado: 'Disponible', precio: 420 },
        { numero: '101', tipo: 'Doble Estándar', estado: 'Disponible', precio: 150 },
        { numero: '102', tipo: 'Doble Estándar', estado: 'Ocupada', precio: 150 },
        { numero: '205', tipo: 'Junior Suite', estado: 'Disponible', precio: 220 },
    ];

    filteredHuespedes: Huesped[] = [];
    filteredRooms: RoomMock[] = [];

    searchHuesped = '';
    selectedHuesped: Huesped = this.huespedesList[0];

    fechaEntrada = '';
    fechaSalida = '';
    noches = 5;

    filtroCategoria = '';
    filtroPlanta = '';
    selectedRoomNumber = '402';

    // Toast notifications
    toastMsg = '';
    toastSuccess = true;
    private toastTimer: any;

    ngOnInit() {
        // Load guests list from localStorage or populate default
        const stored = localStorage.getItem('hotel_huespedes');
        if (stored) {
            this.huespedesList = JSON.parse(stored);
        } else {
            localStorage.setItem('hotel_huespedes', JSON.stringify(this.huespedesList));
        }

        // Set default selected guest
        if (this.huespedesList.length > 0) {
            this.selectedHuesped = this.huespedesList[0];
        }

        // Set mock dates: today and 5 days later
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + 5);

        this.fechaEntrada = today.toISOString().split('T')[0];
        this.fechaSalida = future.toISOString().split('T')[0];

        this.filtrarHabitaciones();
    }

    filtrarHuespedes() {
        if (!this.searchHuesped.trim()) {
            this.filteredHuespedes = [];
            return;
        }
        const q = this.searchHuesped.toLowerCase();
        this.filteredHuespedes = this.huespedesList.filter(h => 
            h.nombre.toLowerCase().includes(q)
        );
    }

    selectHuesped(h: Huesped) {
        this.selectedHuesped = h;
        this.searchHuesped = '';
        this.filteredHuespedes = [];
    }

    nuevoHuesped() {
        // Simple mock rotation for demonstration
        const index = (this.huespedesList.indexOf(this.selectedHuesped) + 1) % this.huespedesList.length;
        this.selectedHuesped = this.huespedesList[index];
        this.showToast(`Cargado huésped: ${this.selectedHuesped.nombre}`);
    }

    calcularNoches() {
        if (!this.fechaEntrada || !this.fechaSalida) {
            this.noches = 0;
            return;
        }
        const d1 = new Date(this.fechaEntrada);
        const d2 = new Date(this.fechaSalida);
        const diff = d2.getTime() - d1.getTime();
        this.noches = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    filtrarHabitaciones() {
        let r = [...this.roomsList];
        if (this.filtroCategoria) {
            r = r.filter(room => room.tipo === this.filtroCategoria);
        }
        if (this.filtroPlanta) {
            r = r.filter(room => {
                const floor = parseInt(room.numero.charAt(0));
                return this.filtroPlanta === 'baja' ? floor <= 2 : floor >= 3;
            });
        }
        this.filteredRooms = r;
    }

    selectRoom(room: RoomMock) {
        this.selectedRoomNumber = room.numero;
        this.showToast(`Habitación #${room.numero} seleccionada`);
    }

    getRoomCardClass(room: RoomMock): string {
        if (this.selectedRoomNumber === room.numero) {
            return 'border-2 border-primary bg-primary/5';
        }
        if (room.estado === 'Ocupada') {
            return 'border-outline-variant bg-surface opacity-50 cursor-not-allowed';
        }
        return 'border-outline-variant bg-surface hover:border-primary/50';
    }

    getRoomStatusColor(estado: string): string {
        switch (estado) {
            case 'Disponible': return 'text-secondary';
            case 'Requiere Limpieza': return 'text-error';
            default: return 'text-on-surface-variant';
        }
    }

    resetForm() {
        this.selectedHuesped = this.huespedesList[0];
        this.selectedRoomNumber = '402';
        this.filtroCategoria = '';
        this.filtroPlanta = '';
        this.ngOnInit();
        this.showToast('Formulario restablecido');
    }

    guardarReservacion() {
        const room = this.roomsList.find(r => r.numero === this.selectedRoomNumber);
        if (!room) {
            this.showToast('Selecciona una habitación válida', false);
            return;
        }

        // Add reservation to the room list storage so it gets marked as occupied!
        const habitacionesLocales = localStorage.getItem('hotel_habitaciones_v2');
        if (habitacionesLocales) {
            const list: any[] = JSON.parse(habitacionesLocales);
            const index = list.findIndex(h => h.numero === this.selectedRoomNumber);
            if (index !== -1) {
                list[index].estado = 'Ocupada';
                list[index].huesped = this.selectedHuesped.nombre;
                list[index].checkin = this.fechaEntrada;
                list[index].checkout = this.fechaSalida;
                list[index].precio = room.precio;
                localStorage.setItem('hotel_habitaciones_v2', JSON.stringify(list));
            }
        }

        this.showToast(`Reservación guardada con éxito para la Habitación ${this.selectedRoomNumber}`);
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
