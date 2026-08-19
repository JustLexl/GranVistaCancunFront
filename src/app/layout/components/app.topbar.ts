import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [RouterModule, CommonModule, FormsModule],
    template: `
<header class="hgv-topbar">
    <!-- Mobile menu toggle -->
    <button class="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low mr-2 cursor-pointer" (click)="toggleMobileMenu()">
        <span class="material-symbols-outlined">menu</span>
    </button>

    <!-- Search -->
    <div class="flex-1 max-w-sm relative hidden md:block">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
        <input
            type="text"
            [(ngModel)]="searchVal"
            placeholder="Buscar..."
            class="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
    </div>

    <div class="flex items-center gap-2 ml-auto">
        <!-- Notifications -->
        <button class="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer">
            <span class="material-symbols-outlined">notifications</span>
        </button>

        <!-- Profile dropdown -->
        <div class="relative" (click)="toggleDropdown()" (document:click)="onDocClick($event)">
            <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer" #profileBtn>
                <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-sm font-bold">
                    {{ getInitial() }}
                </div>
                <span class="hidden md:block text-sm font-medium text-on-surface max-w-[120px] truncate">
                    {{ authService.userProfile()?.name || 'Usuario' }}
                </span>
                <span class="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
            </button>

            <!-- Dropdown -->
            <div *ngIf="dropdownOpen"
                 class="absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-2 z-[200] animate-fade-in"
                 (click)="$event.stopPropagation()">
                <div class="px-4 py-3 border-b border-outline-variant/20">
                    <p class="text-sm font-bold text-on-surface truncate">{{ authService.userProfile()?.name || 'Usuario' }}</p>
                    <p class="text-xs text-on-surface-variant truncate">{{ authService.userProfile()?.jobPosition || 'Invitado' }}</p>
                </div>
                <a routerLink="/Inicio/perfil" (click)="dropdownOpen=false"
                   class="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-sm">person</span>
                    Editar Perfil
                </a>
                <button (click)="signOut()"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/20 transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-sm">logout</span>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    </div>
</header>
    `,
    styles: [`
        :host { display: contents; }
        .hgv-topbar {
            position: sticky;
            top: 0;
            z-index: 40;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 24px;
            background: rgba(249,249,255,0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(191,199,209,0.4);
        }
        @keyframes fadeIn {
            from { opacity:0; transform:translateY(-6px); }
            to   { opacity:1; transform:translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.18s ease-out; }
    `],
    host: { class: 'hgv-topbar-host' }
})
export class AppTopbar {
    authService = inject(AuthService);

    searchVal    = '';
    dropdownOpen = false;

    toggleMobileMenu() {
        document.body.classList.toggle('mobile-sidebar-open');
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    onDocClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest('.relative')) {
            this.dropdownOpen = false;
        }
    }

    getInitial(): string {
        const name = this.authService.userProfile()?.name || 'U';
        return name.charAt(0).toUpperCase();
    }

    signOut() {
        this.dropdownOpen = false;
        this.authService.logout();
    }
}
