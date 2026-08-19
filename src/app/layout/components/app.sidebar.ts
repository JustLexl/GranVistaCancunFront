import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppMenu } from './app.menu';

@Component({
    selector: '[app-sidebar]',
    standalone: true,
    imports: [AppMenu, RouterModule],
    template: `
<aside class="hgv-sidebar">
    <!-- Brand -->
    <div class="px-6 pt-6 pb-5 border-b border-outline-variant/30">
        <a routerLink="/Inicio/GestionHabitaciones" class="flex items-center gap-3 cursor-pointer">
            <img src="/layout/images/Logo hotel.jpg" alt="Hotel Gran Vista" class="h-9 w-auto rounded-lg object-contain" />
            <div>
                <h1 class="text-sm font-bold text-primary leading-tight">Hotel Gran Vista</h1>
                <p class="text-xs text-on-surface-variant">Management Portal</p>
            </div>
        </a>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto py-4" app-menu></div>

    <!-- Footer -->
    <div class="px-4 py-4 border-t border-outline-variant/20">
        <p class="text-[11px] text-on-surface-variant/60 text-center">© 2026 Hotel Gran Vista</p>
    </div>
</aside>
    `,
    styles: [`
        :host { display: contents; }
        .hgv-sidebar {
            position: fixed;
            left: 0; top: 0;
            height: 100vh;
            width: 260px;
            background: #ffffff;
            border-right: 1px solid rgba(191,199,209,0.4);
            box-shadow: 0 1px 3px rgba(0,93,144,0.06);
            z-index: 50;
            display: flex;
            flex-direction: column;
            transition: transform 0.25s ease;
        }
        @media (max-width: 991px) {
            .hgv-sidebar { transform: translateX(-100%); }
            :host(.mobile-open) .hgv-sidebar { transform: translateX(0); }
        }
    `]
})
export class AppSidebar {}
