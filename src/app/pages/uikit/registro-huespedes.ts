import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Huesped {
    id: string;
    nombre: string;
    telefono: string;
    email: string;
    tipo: string;
    initials: string;
}

@Component({
    selector: 'app-registro-huespedes',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
<div class="w-full relative min-h-screen pb-12 flex items-center justify-center">
    <!-- Blurred Background with Glassmorphism Overlay -->
    <div class="fixed inset-0 z-[-1]">
        <img alt="" class="w-full h-full object-cover opacity-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnJNlAjN5Z0yC8AEuKybx7mPKZ05pJp9gFMHlrtbnmOFS0saD2jAYA5M0ctbuaJTK9r5zPHKrraS9O7RqE1IS-yYCKKRP3OK_4YtbEEe8jPPwvnN2H_7QFPtOBoFB2m1tw7lbYOKLVzQ_m4lFs-A_wBsJNJGRhDoKIRcY57W3cCmyejuNfDk7PSsFTdRDl3PyLXwqiKAeXkhUujmHBX7FOhhRRItDGUwHYzxWexAx6PnqRL-LX9dJ-5wlMPADNdG7tlA"/>
        <div class="absolute inset-0 bg-surface/60 backdrop-blur-xl"></div>
    </div>

    <!-- Registration Card (Glassmorphism) -->
    <div class="bg-surface/70 backdrop-blur-2xl border border-outline-variant/40 shadow-[0_8px_32px_rgba(0,119,182,0.1)] rounded-xl p-6 md:p-8 my-8" style="width: 480px; max-width: 90%;">
        <div class="mb-6 text-center">
            <div class="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto mb-4 border border-primary-container/30">
                <span class="material-symbols-outlined text-primary" style="font-size: 28px;">person_add</span>
            </div>
            <h2 class="text-2xl font-bold text-on-surface">Registro de Nuevo Huésped</h2>
            <p class="text-sm text-on-surface-variant mt-2">Ingrese los datos del huésped para crear un nuevo perfil en el directorio.</p>
        </div>

        <form class="flex flex-col gap-6" (ngSubmit)="registrarHuesped()">
            <!-- Full Name -->
            <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-on-surface" for="fullName">Nombre completo</label>
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">person</span>
                    <input 
                        class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pr-3 pl-10 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm transition-all hover:border-outline" 
                        id="fullName" 
                        [(ngModel)]="nombre"
                        name="fullName"
                        placeholder="Ej. Ana García" 
                        type="text" 
                        required />
                </div>
            </div>

            <!-- Phone -->
            <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-on-surface" for="phone">Teléfono</label>
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">phone</span>
                    <input 
                        class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pr-3 pl-10 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm transition-all hover:border-outline" 
                        id="phone" 
                        [(ngModel)]="telefono"
                        name="phone"
                        placeholder="+34 600 000 000" 
                        type="tel" 
                        required />
                </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold text-on-surface" for="email">Correo electrónico</label>
                <div class="relative">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                    <input 
                        class="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pr-3 pl-10 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm transition-all hover:border-outline" 
                        id="email" 
                        [(ngModel)]="email"
                        name="email"
                        placeholder="ana.garcia@ejemplo.com" 
                        type="email" 
                        required />
                </div>
            </div>

            <!-- Divider -->
            <hr class="border-t border-outline-variant/30 my-2"/>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2">
                <button 
                    class="px-5 py-3 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors border border-transparent hover:border-primary/20 cursor-pointer" 
                    type="button"
                    (click)="limpiarFormulario()">
                    Cancelar
                </button>
                <button 
                    class="px-5 py-3 bg-primary-container text-on-primary-container text-sm rounded-lg hover:bg-primary hover:text-on-primary transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer" 
                    type="submit">
                    <span class="material-symbols-outlined" style="font-size: 18px;">how_to_reg</span>
                    Registrar Huésped
                </button>
            </div>
        </form>
    </div>
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
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in  { animation: fadeIn 0.3s ease-out forwards; }
    `]
})
export class RegistroHuespedesComponent implements OnInit {
    nombre = '';
    telefono = '';
    email = '';

    toastMsg = '';
    toastSuccess = true;
    private toastTimer: any;

    ngOnInit() {}

    registrarHuesped() {
        if (!this.nombre.trim() || !this.telefono.trim() || !this.email.trim()) {
            this.showToast('Por favor, rellene todos los campos', false);
            return;
        }

        // Load existing guests
        const stored = localStorage.getItem('hotel_huespedes');
        let huespedesList: Huesped[] = [];
        const defaultHuespedes = [
            { id: 'G-8472', nombre: 'Carlos Mendoza', telefono: '+52 555-0192', email: 'carlos@mendoza.com', tipo: 'VIP', initials: 'CM' },
            { id: 'G-1024', nombre: 'Alejandro Gomez', telefono: '+52 555-0183', email: 'ale@gomez.com', tipo: 'Regular', initials: 'AG' },
            { id: 'G-2309', nombre: 'María Rodríguez', telefono: '+52 555-0174', email: 'maria@rodriguez.com', tipo: 'Frecuente', initials: 'MR' },
            { id: 'G-9844', nombre: 'Lucía Fernández', telefono: '+52 555-0165', email: 'lucia@fernandez.com', tipo: 'VIP', initials: 'LF' }
        ];

        if (stored) {
            huespedesList = JSON.parse(stored);
        } else {
            huespedesList = [...defaultHuespedes];
        }

        // Generate Initials
        const names = this.nombre.trim().split(' ');
        let initials = '';
        if (names.length > 0) {
            initials += names[0].charAt(0).toUpperCase();
        }
        if (names.length > 1) {
            initials += names[names.length - 1].charAt(0).toUpperCase();
        } else {
            initials += names[0].charAt(Math.min(1, names[0].length - 1)).toUpperCase();
        }

        // Generate ID
        const randomId = 'G-' + Math.floor(1000 + Math.random() * 9000);

        const nuevo: Huesped = {
            id: randomId,
            nombre: this.nombre,
            telefono: this.telefono,
            email: this.email,
            tipo: 'Regular',
            initials: initials
        };

        huespedesList.push(nuevo);
        localStorage.setItem('hotel_huespedes', JSON.stringify(huespedesList));

        this.showToast(`Huésped ${this.nombre} registrado con éxito con ID ${randomId}`);
        this.limpiarFormulario();
    }

    limpiarFormulario() {
        this.nombre = '';
        this.telefono = '';
        this.email = '';
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
