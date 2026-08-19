import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type EstadoHabitacion = 'Disponible' | 'Ocupada' | 'Mantenimiento' | 'Limpieza' | 'Sucia';
export type TipoHabitacion = 'Doble Superior' | 'Suite Ejecutiva' | 'Individual' | 'Junior Suite';

export interface Habitacion {
    numero: string;
    tipo: TipoHabitacion;
    estado: EstadoHabitacion;
    amenidades: string[];
    huesped: string | null;
    checkin: string | null;
    checkout: string | null;
    notas: string;
    precio: number;
}

const AMENITY_ICONS: Record<string, string> = {
    'water': 'water',
    'balcony': 'balcony',
    'jacuzzi': 'hot_tub',
    'panorama': 'panorama',
    'escritorio': 'desk',
    'cuna': 'crib',
    'wifi': 'wifi',
    'aire': 'air',
    'minibar': 'liquor',
    'tv': 'tv',
};

const DEFAULT_ROOMS: Habitacion[] = [
    { numero: '101', tipo: 'Doble Superior',  estado: 'Disponible',   amenidades: ['water', 'balcony'],    huesped: null, checkin: null, checkout: null, notas: '', precio: 1200 },
    { numero: '102', tipo: 'Individual',       estado: 'Disponible',   amenidades: ['escritorio', 'wifi'],  huesped: null, checkin: null, checkout: null, notas: '', precio: 900 },
    { numero: '103', tipo: 'Doble Superior',   estado: 'Ocupada',      amenidades: ['water', 'cuna'],       huesped: 'Carlos Reyes', checkin: '2026-08-14', checkout: '2026-08-20', notas: '', precio: 1200 },
    { numero: '112', tipo: 'Individual',       estado: 'Disponible',   amenidades: ['escritorio'],          huesped: null, checkin: null, checkout: null, notas: '', precio: 850 },
    { numero: '201', tipo: 'Junior Suite',     estado: 'Limpieza',     amenidades: ['balcony', 'minibar'],  huesped: null, checkin: null, checkout: null, notas: 'Requiere limpieza profunda', precio: 2000 },
    { numero: '204', tipo: 'Suite Ejecutiva',  estado: 'Ocupada',      amenidades: ['jacuzzi', 'panorama'], huesped: 'Ana Martínez', checkin: '2026-08-15', checkout: '2026-08-22', notas: 'VIP', precio: 3500 },
    { numero: '301', tipo: 'Doble Superior',   estado: 'Disponible',   amenidades: ['water', 'tv'],         huesped: null, checkin: null, checkout: null, notas: '', precio: 1300 },
    { numero: '302', tipo: 'Junior Suite',     estado: 'Disponible',   amenidades: ['balcony', 'aire'],     huesped: null, checkin: null, checkout: null, notas: '', precio: 1900 },
    { numero: '305', tipo: 'Doble Superior',   estado: 'Ocupada',      amenidades: ['water', 'cuna'],       huesped: 'Roberto Silva', checkin: '2026-08-16', checkout: '2026-08-19', notas: '', precio: 1250 },
    { numero: '401', tipo: 'Suite Ejecutiva',  estado: 'Mantenimiento',amenidades: ['jacuzzi', 'panorama'], huesped: null, checkin: null, checkout: null, notas: 'Fuga en baño principal', precio: 3800 },
    { numero: '402', tipo: 'Suite Ejecutiva',  estado: 'Disponible',   amenidades: ['jacuzzi', 'minibar'],  huesped: null, checkin: null, checkout: null, notas: '', precio: 3600 },
    { numero: '403', tipo: 'Junior Suite',     estado: 'Ocupada',      amenidades: ['balcony', 'wifi'],     huesped: 'Sofia Loren', checkin: '2026-08-12', checkout: '2026-08-25', notas: '', precio: 2100 },
];

@Component({
    selector: 'app-gestion-habitaciones',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
<!-- Relative wrapper so background image stays inside the page area -->
<div class="relative min-h-screen">

    <!-- Background blur image -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
            alt="Hotel background"
            class="w-full h-full object-cover opacity-30 blur-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNAzrjkhGDNMkYFCg2zf70fyOFAC4I4vg5OQNgn2Al_A8PedaWCbi_UBs0O-Q882Ju3PnJSOs6X3ZHGMSecOQUoRykyxU4-QTvky5syLB33Z0ZAdYjfn6zxCF2-tuRj4BOZoxW4vlqiv0ScVoPNQNml0WvCEeH5D2Zj-ZToEfdmCVHAlMo6d7CFg5h4dTUK5mTx0Ngg8_9duSU5xcCns_uIi3hEnNRmB8yWPAyfZAXzcc4NCgCttCddF-L9ctFThpXaA" />
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
    </div>

    <!-- Canvas -->
    <main class="relative z-10 p-8">
        <div class="max-w-7xl mx-auto space-y-6">

            <!-- Page Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h2 class="text-3xl font-bold text-on-surface mb-2 tracking-tight">Gestión de Habitaciones</h2>
                    <p class="text-on-surface-variant text-base">Consulta el estado y disponibilidad en tiempo real.</p>
                </div>
                <div class="flex gap-4">
                    <button
                        (click)="abrirModalNuevaReserva()"
                        class="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                        <span class="material-symbols-outlined text-sm">add</span>
                        Nueva Reserva
                    </button>
                </div>
            </div>

            <!-- Stats Row -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div (click)="setFiltroEstado('')"
                     class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 flex flex-col cursor-pointer hover:-translate-y-0.5 transition-transform">
                    <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total</span>
                    <span class="text-3xl font-black text-on-surface">{{ habitaciones.length }}</span>
                </div>
                <div (click)="setFiltroEstado('Disponible')"
                     class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 flex flex-col cursor-pointer hover:-translate-y-0.5 transition-transform">
                    <span class="text-xs font-bold uppercase tracking-wider" style="color: #2c694e;">Disponibles</span>
                    <span class="text-3xl font-black" style="color: #2c694e;">{{ getCount('Disponible') }}</span>
                </div>
                <div (click)="setFiltroEstado('Ocupada')"
                     class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 flex flex-col cursor-pointer hover:-translate-y-0.5 transition-transform">
                    <span class="text-xs font-bold text-on-error-container uppercase tracking-wider">Ocupadas</span>
                    <span class="text-3xl font-black text-error">{{ getCount('Ocupada') }}</span>
                </div>
                <div (click)="setFiltroEstado('Mantenimiento')"
                     class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-4 flex flex-col cursor-pointer hover:-translate-y-0.5 transition-transform">
                    <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mant./Limpieza</span>
                    <span class="text-3xl font-black text-on-surface-variant">{{ getCount('Mantenimiento') + getCount('Limpieza') }}</span>
                </div>
            </div>

            <!-- Filters & Controls -->
            <div class="bg-surface-container-lowest rounded-xl shadow-sm p-6 border border-outline-variant/30 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div class="flex flex-wrap gap-3">
                    <!-- Search -->
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                        <input
                            type="text"
                            [(ngModel)]="searchQuery"
                            (ngModelChange)="aplicarFiltros()"
                            placeholder="Buscar habitación o huésped..."
                            class="pl-9 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none w-56" />
                    </div>

                    <!-- Tipo -->
                    <select
                        [(ngModel)]="filtroTipo"
                        (change)="aplicarFiltros()"
                        class="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                        <option value="">Todos los Tipos</option>
                        <option value="Doble Superior">Doble Superior</option>
                        <option value="Suite Ejecutiva">Suite Ejecutiva</option>
                        <option value="Individual">Individual</option>
                        <option value="Junior Suite">Junior Suite</option>
                    </select>

                    <!-- Estado -->
                    <select
                        [(ngModel)]="filtroEstado"
                        (change)="aplicarFiltros()"
                        class="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                        <option value="">Cualquier Estado</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupada">Ocupada</option>
                        <option value="Limpieza">Limpieza</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                </div>

                <div class="flex items-center gap-4">
                    <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Vista:</span>
                    <div class="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/50">
                        <button
                            (click)="vistaGrid = true"
                            [class]="vistaGrid ? 'p-2 rounded bg-surface shadow-sm text-primary' : 'p-2 rounded text-on-surface-variant hover:text-primary'">
                            <span class="material-symbols-outlined text-base leading-none">grid_view</span>
                        </button>
                        <button
                            (click)="vistaGrid = false"
                            [class]="!vistaGrid ? 'p-2 rounded bg-surface shadow-sm text-primary' : 'p-2 rounded text-on-surface-variant hover:text-primary'">
                            <span class="material-symbols-outlined text-base leading-none">table_rows</span>
                        </button>
                    </div>
                    <button
                        (click)="limpiarFiltros()"
                        class="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                        <span class="material-symbols-outlined text-sm">refresh</span> Limpiar
                    </button>
                </div>
            </div>

            <!-- ─── GRID VIEW ─── -->
            <div *ngIf="vistaGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                <div
                    *ngFor="let room of habitacionesFiltradas"
                    (click)="seleccionarHabitacion(room)"
                    class="bg-surface-container-lowest rounded-xl shadow-sm p-6 border border-outline-variant/30 hover:-translate-y-1 transition-transform duration-200 cursor-pointer relative overflow-hidden group">

                    <!-- Colored top bar -->
                    <div class="absolute top-0 left-0 w-full h-1" [class]="getTopBarClass(room.estado)"></div>

                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-on-surface">{{ room.numero }}</h3>
                            <p class="text-sm text-on-surface-variant">{{ room.tipo }}</p>
                        </div>
                        <!-- Status badge -->
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" [class]="getBadgeClass(room.estado)">
                            <span class="w-2 h-2 rounded-full" [class]="getDotClass(room.estado)"></span>
                            {{ room.estado }}
                        </span>
                    </div>

                    <!-- Guest info if occupied -->
                    <div *ngIf="room.estado === 'Ocupada' && room.huesped" class="mb-3 text-xs text-on-surface-variant bg-surface-container-low rounded-lg px-3 py-2">
                        <span class="material-symbols-outlined text-xs align-middle mr-1">person</span>
                        {{ room.huesped }}
                        <span *ngIf="room.checkout" class="block mt-0.5 text-outline">Out: {{ room.checkout }}</span>
                    </div>

                    <!-- Notes -->
                    <div *ngIf="room.notas" class="mb-3 text-xs italic text-on-surface-variant/70 truncate">
                        <span class="material-symbols-outlined text-xs align-middle mr-1">notes</span>{{ room.notas }}
                    </div>

                    <div class="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20">
                        <!-- Amenity icons -->
                        <div class="flex gap-2">
                            <span
                                *ngFor="let a of room.amenidades"
                                [title]="a"
                                class="material-symbols-outlined text-outline text-sm">{{ getAmenityIcon(a) }}</span>
                        </div>
                        <button class="text-primary text-xs font-bold hover:underline">
                            {{ room.estado === 'Ocupada' ? 'Gestionar' : 'Detalles' }}
                        </button>
                    </div>
                </div>

            </div>

            <!-- ─── LIST VIEW ─── -->
            <div *ngIf="!vistaGrid" class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <table class="w-full text-sm">
                    <thead class="border-b border-outline-variant/30 bg-surface-container-low">
                        <tr>
                            <th class="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">N°</th>
                            <th class="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tipo</th>
                            <th class="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Estado</th>
                            <th class="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Huésped</th>
                            <th class="text-left py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Check-out</th>
                            <th class="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            *ngFor="let room of habitacionesFiltradas; let odd = odd"
                            (click)="seleccionarHabitacion(room)"
                            [class]="odd ? 'bg-surface-container-low/40 hover:bg-surface-container cursor-pointer transition-colors' : 'hover:bg-surface-container-low cursor-pointer transition-colors'">
                            <td class="py-3 px-6 font-bold text-on-surface">{{ room.numero }}</td>
                            <td class="py-3 px-6 text-on-surface-variant">{{ room.tipo }}</td>
                            <td class="py-3 px-6">
                                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" [class]="getBadgeClass(room.estado)">
                                    <span class="w-1.5 h-1.5 rounded-full" [class]="getDotClass(room.estado)"></span>
                                    {{ room.estado }}
                                </span>
                            </td>
                            <td class="py-3 px-6 text-on-surface-variant hidden md:table-cell">{{ room.huesped || '—' }}</td>
                            <td class="py-3 px-6 text-on-surface-variant hidden lg:table-cell">{{ room.checkout || '—' }}</td>
                            <td class="py-3 px-6 text-right">
                                <button class="text-primary text-xs font-bold hover:underline">
                                    {{ room.estado === 'Ocupada' ? 'Gestionar' : 'Detalles' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty state -->
            <div *ngIf="habitacionesFiltradas.length === 0" class="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-16 text-center">
                <span class="material-symbols-outlined text-5xl text-outline mb-3 block">search_off</span>
                <h3 class="text-base font-bold text-on-surface">No se encontraron habitaciones</h3>
                <p class="text-on-surface-variant text-sm mt-1">Ajusta los filtros o limpia la búsqueda.</p>
                <button (click)="limpiarFiltros()" class="mt-4 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs px-4 py-2 rounded-lg cursor-pointer">
                    Limpiar Filtros
                </button>
            </div>

        </div>
    </main>
</div>

<!-- ─── MODAL DE GESTIÓN ─── -->
<div *ngIf="modalVisible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" (click)="cerrarModal()">
    <div class="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"></div>
    <div class="relative bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 w-full max-w-md p-8 animate-scale-in" (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
            <div>
                <div class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Habitación</div>
                <h3 class="text-2xl font-black text-on-surface">#{{ selectedRoom?.numero }}</h3>
                <p class="text-sm text-on-surface-variant">{{ selectedRoom?.tipo }}</p>
            </div>
            <button (click)="cerrarModal()" class="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-low cursor-pointer transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <ng-container *ngIf="selectedRoom">

            <!-- Status selector -->
            <div class="mb-5">
                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Cambiar Estado</label>
                <div class="grid grid-cols-2 gap-2">
                    <button
                        *ngFor="let e of estados"
                        type="button"
                        (click)="cambiarEstado(e)"
                        [class]="selectedRoom.estado === e ? getBtnActiveClass(e) : 'border border-outline-variant text-on-surface-variant bg-surface hover:bg-surface-container-low'"
                        class="py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer">
                        {{ e }}
                    </button>
                </div>
            </div>

            <!-- Guest data when occupied -->
            <div *ngIf="selectedRoom.estado === 'Ocupada'" class="space-y-3 bg-surface-container-low/60 p-4 rounded-xl border border-outline-variant/30 mb-5 animate-fade-in">
                <h4 class="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">id_card</span> Datos del Check-in
                </h4>
                <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nombre del Huésped</label>
                    <input type="text" [(ngModel)]="selectedRoom.huesped" placeholder="Ej. María González"
                        class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Check-in</label>
                        <input type="date" [(ngModel)]="selectedRoom.checkin"
                            class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Check-out</label>
                        <input type="date" [(ngModel)]="selectedRoom.checkout"
                            class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Precio / Noche ($)</label>
                    <input type="number" [(ngModel)]="selectedRoom.precio"
                        class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
            </div>

            <!-- Notes -->
            <div class="mb-5">
                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Notas / Observaciones</label>
                <textarea rows="2" [(ngModel)]="selectedRoom.notas" placeholder="Notas de limpieza, requerimientos especiales..."
                    class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/50"></textarea>
            </div>

            <!-- Quick actions -->
            <div class="flex gap-2 mb-5" *ngIf="originalEstado === 'Ocupada' || originalEstado === 'Sucia' || originalEstado === 'Limpieza'">
                <button *ngIf="originalEstado === 'Ocupada'" type="button" (click)="checkoutRapido()"
                    class="flex-1 bg-error text-on-primary hover:bg-error/90 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">logout</span> Registrar Check-out
                </button>
                <button *ngIf="originalEstado === 'Limpieza' || originalEstado === 'Sucia'" type="button" (click)="limpiezaRapida()"
                    class="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer text-on-primary"
                    style="background-color: #2c694e;">
                    <span class="material-symbols-outlined text-sm">check_circle</span> Marcar como Disponible
                </button>
            </div>

            <!-- Save / Cancel -->
            <div class="flex gap-3 justify-end border-t border-outline-variant/20 pt-4">
                <button (click)="cerrarModal()" class="px-4 py-2 border border-outline-variant hover:bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-lg cursor-pointer">
                    Cancelar
                </button>
                <button (click)="guardar()" class="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold rounded-lg cursor-pointer">
                    Guardar Cambios
                </button>
            </div>
        </ng-container>
    </div>
</div>

<!-- ─── MODAL NUEVA RESERVA ─── -->
<div *ngIf="modalNuevaReserva" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" (click)="modalNuevaReserva = false">
    <div class="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"></div>
    <div class="relative bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 w-full max-w-sm p-8 animate-scale-in" (click)="$event.stopPropagation()">

        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-on-surface">Nueva Habitación</h3>
            <button (click)="modalNuevaReserva = false" class="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-low cursor-pointer">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <div class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Número de Habitación</label>
                <input type="text" [(ngModel)]="nuevaHab.numero" placeholder="Ej. 501"
                    class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tipo</label>
                <select [(ngModel)]="nuevaHab.tipo" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="Individual">Individual</option>
                    <option value="Doble Superior">Doble Superior</option>
                    <option value="Junior Suite">Junior Suite</option>
                    <option value="Suite Ejecutiva">Suite Ejecutiva</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Precio / Noche ($)</label>
                <input type="number" [(ngModel)]="nuevaHab.precio"
                    class="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
        </div>

        <div *ngIf="errorMsg" class="mt-4 text-xs text-error font-semibold">{{ errorMsg }}</div>

        <div class="flex gap-3 justify-end mt-6 border-t border-outline-variant/20 pt-4">
            <button (click)="modalNuevaReserva = false" class="px-4 py-2 border border-outline-variant text-on-surface-variant text-xs font-bold rounded-lg cursor-pointer">
                Cancelar
            </button>
            <button (click)="guardarNuevaHab()" class="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold rounded-lg cursor-pointer">
                Agregar
            </button>
        </div>
    </div>
</div>

<!-- Toast notification -->
<div *ngIf="toastMsg" class="fixed bottom-6 right-6 z-[99999] bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-fade-in">
    <span class="material-symbols-outlined text-sm" [class]="toastSuccess ? 'text-secondary-container' : 'text-error-container'">
        {{ toastSuccess ? 'check_circle' : 'error' }}
    </span>
    {{ toastMsg }}
</div>
    `,
    styles: [`
        :host { display: block; width: 100%; }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .animate-scale-in { animation: scaleIn 0.25s ease-out forwards; }
        .animate-fade-in  { animation: fadeIn 0.3s ease-out forwards; }
    `]
})
export class GestionHabitacionesComponent implements OnInit {

    // ── State ──────────────────────────────────────────────────────
    habitaciones: Habitacion[] = [];
    habitacionesFiltradas: Habitacion[] = [];

    filtroTipo    = '';
    filtroEstado  = '';
    searchQuery   = '';
    vistaGrid     = true;

    estados: EstadoHabitacion[] = ['Disponible', 'Ocupada', 'Limpieza', 'Sucia', 'Mantenimiento'];

    // Modal gestión
    modalVisible  = false;
    selectedRoom: Habitacion | null = null;
    originalEstado: EstadoHabitacion | null = null;

    // Modal nueva habitación
    modalNuevaReserva = false;
    nuevaHab: Partial<Habitacion> = {};
    errorMsg = '';

    // Toast
    toastMsg     = '';
    toastSuccess = true;
    private toastTimer: any;

    // ── Lifecycle ──────────────────────────────────────────────────
    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        const stored = localStorage.getItem('hotel_habitaciones_v2');
        this.habitaciones = stored ? JSON.parse(stored) : [...DEFAULT_ROOMS];
        if (!stored) this.save();
        this.aplicarFiltros();
    }

    // ── Filters ────────────────────────────────────────────────────
    setFiltroEstado(e: string) {
        this.filtroEstado = e;
        this.aplicarFiltros();
    }

    aplicarFiltros() {
        let r = [...this.habitaciones];
        if (this.filtroTipo)    r = r.filter(h => h.tipo   === this.filtroTipo);
        if (this.filtroEstado)  r = r.filter(h => h.estado === this.filtroEstado);
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase();
            r = r.filter(h =>
                h.numero.includes(q) ||
                h.tipo.toLowerCase().includes(q) ||
                (h.huesped && h.huesped.toLowerCase().includes(q))
            );
        }
        this.habitacionesFiltradas = r;
        this.cdr.detectChanges();
    }

    limpiarFiltros() {
        this.filtroTipo = '';
        this.filtroEstado = '';
        this.searchQuery = '';
        this.aplicarFiltros();
    }

    getCount(e: EstadoHabitacion): number {
        return this.habitaciones.filter(h => h.estado === e).length;
    }

    // ── Styling helpers ────────────────────────────────────────────
    getTopBarClass(e: EstadoHabitacion): string {
        switch (e) {
            case 'Disponible':    return 'bg-secondary-container';
            case 'Ocupada':       return 'bg-error-container';
            case 'Sucia':         return 'bg-primary-fixed-dim';
            case 'Limpieza':      return 'bg-primary-fixed';
            case 'Mantenimiento': return 'bg-surface-variant';
            default:              return 'bg-surface-variant';
        }
    }

    getBadgeClass(e: EstadoHabitacion): string {
        switch (e) {
            case 'Disponible':    return 'bg-secondary-container/30 text-on-secondary-container';
            case 'Ocupada':       return 'bg-error-container/30 text-on-error-container';
            case 'Sucia':         return 'bg-primary-fixed-dim/30 text-on-primary-fixed-variant';
            case 'Limpieza':      return 'bg-primary-fixed/30 text-on-primary-fixed-variant';
            case 'Mantenimiento': return 'bg-surface-variant/60 text-on-surface-variant';
            default:              return 'bg-surface-variant/60 text-on-surface-variant';
        }
    }

    getDotClass(e: EstadoHabitacion): string {
        switch (e) {
            case 'Disponible':    return 'bg-secondary-fixed';
            case 'Ocupada':       return 'bg-error';
            case 'Sucia':         return 'bg-primary-fixed-dim';
            case 'Limpieza':      return 'bg-primary';
            case 'Mantenimiento': return 'bg-outline';
            default:              return 'bg-outline';
        }
    }

    getBtnActiveClass(e: EstadoHabitacion): string {
        switch (e) {
            case 'Disponible':    return 'border-2 border-secondary text-secondary bg-secondary-container/20 ring-1 ring-secondary';
            case 'Ocupada':       return 'border-2 border-error text-error bg-error-container/20 ring-1 ring-error';
            case 'Sucia':         return 'border-2 border-primary text-primary bg-primary-fixed-dim/20 ring-1 ring-primary';
            case 'Limpieza':      return 'border-2 border-primary text-primary bg-primary-fixed/20 ring-1 ring-primary';
            case 'Mantenimiento': return 'border-2 border-outline text-on-surface bg-surface-variant/30 ring-1 ring-outline';
            default:              return 'border-2 border-outline text-on-surface bg-surface-variant/30';
        }
    }

    getAmenityIcon(a: string): string {
        return AMENITY_ICONS[a] || a;
    }

    // ── Modal gestión ──────────────────────────────────────────────
    seleccionarHabitacion(room: Habitacion) {
        this.selectedRoom  = JSON.parse(JSON.stringify(room));
        this.originalEstado = room.estado;
        this.modalVisible  = true;
    }

    cambiarEstado(e: EstadoHabitacion) {
        if (!this.selectedRoom) return;
        this.selectedRoom.estado = e;
        if (e !== 'Ocupada') {
            this.selectedRoom.huesped  = null;
            this.selectedRoom.checkin  = null;
            this.selectedRoom.checkout = null;
        } else if (!this.selectedRoom.huesped) {
            const hoy   = new Date().toISOString().split('T')[0];
            const man   = new Date(Date.now() + 86400000).toISOString().split('T')[0];
            this.selectedRoom.huesped  = '';
            this.selectedRoom.checkin  = hoy;
            this.selectedRoom.checkout = man;
        }
    }

    checkoutRapido() {
        if (!this.selectedRoom) return;
        this.selectedRoom.estado   = 'Limpieza';
        this.selectedRoom.huesped  = null;
        this.selectedRoom.checkin  = null;
        this.selectedRoom.checkout = null;
        this.selectedRoom.notas    = 'Salida registrada. Pendiente limpieza.';
        this.guardar();
    }

    limpiezaRapida() {
        if (!this.selectedRoom) return;
        this.selectedRoom.estado = 'Disponible';
        this.selectedRoom.notas  = '';
        this.guardar();
    }

    cerrarModal() {
        this.modalVisible   = false;
        this.selectedRoom   = null;
        this.originalEstado = null;
    }

    guardar() {
        if (!this.selectedRoom) return;
        if (this.selectedRoom.estado === 'Ocupada' && !this.selectedRoom.huesped?.trim()) {
            this.toast('El nombre del huésped es obligatorio.', false);
            return;
        }
        const idx = this.habitaciones.findIndex(h => h.numero === this.selectedRoom!.numero);
        if (idx !== -1) {
            this.habitaciones[idx] = { ...this.selectedRoom } as Habitacion;
            this.save();
            this.aplicarFiltros();
            this.toast(`Habitación #${this.selectedRoom.numero} actualizada.`);
        }
        this.cerrarModal();
    }

    // ── Modal nueva habitación ─────────────────────────────────────
    abrirModalNuevaReserva() {
        this.nuevaHab = { numero: '', tipo: 'Individual', precio: 1200, estado: 'Disponible', amenidades: [], huesped: null, checkin: null, checkout: null, notas: '' };
        this.errorMsg = '';
        this.modalNuevaReserva = true;
    }

    guardarNuevaHab() {
        this.errorMsg = '';
        if (!this.nuevaHab.numero?.trim()) { this.errorMsg = 'El número es obligatorio.'; return; }
        if (this.habitaciones.some(h => h.numero === this.nuevaHab.numero)) { this.errorMsg = `La habitación #${this.nuevaHab.numero} ya existe.`; return; }
        const h: Habitacion = {
            numero:     this.nuevaHab.numero,
            tipo:       (this.nuevaHab.tipo as TipoHabitacion) || 'Individual',
            estado:     'Disponible',
            precio:     this.nuevaHab.precio || 1200,
            amenidades: [],
            huesped:    null,
            checkin:    null,
            checkout:   null,
            notas:      ''
        };
        this.habitaciones.push(h);
        this.habitaciones.sort((a, b) => Number(a.numero) - Number(b.numero));
        this.save();
        this.aplicarFiltros();
        this.modalNuevaReserva = false;
        this.toast(`Habitación #${h.numero} creada con éxito.`);
    }

    // ── Helpers ────────────────────────────────────────────────────
    private save() {
        localStorage.setItem('hotel_habitaciones_v2', JSON.stringify(this.habitaciones));
    }

    private toast(msg: string, success = true) {
        clearTimeout(this.toastTimer);
        this.toastMsg     = msg;
        this.toastSuccess = success;
        this.cdr.detectChanges();
        this.toastTimer = setTimeout(() => { this.toastMsg = ''; this.cdr.detectChanges(); }, 3000);
    }
}
