import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { AppFooter } from './app.footer';
import { AppSidebar } from './app.sidebar';
import { AppBreadcrumb } from './app.breadcrumb';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, AppBreadcrumb],
    template: `
<div class="hgv-layout">
    <!-- Sidebar -->
    <div app-sidebar></div>

    <!-- Main area (offset by sidebar width) -->
    <div class="hgv-main">
        <!-- Topbar -->
        <div app-topbar></div>

        <!-- Page content -->
        <div class="hgv-content">
            <nav app-breadcrumb></nav>
            <router-outlet></router-outlet>
        </div>

        <!-- Footer -->
        <div app-footer></div>
    </div>
</div>
    `,
    styles: [`
        :host { display: block; min-height: 100vh; }
        .hgv-layout {
            display: flex;
            min-height: 100vh;
            background: #f9f9ff;
        }
        .hgv-main {
            flex: 1;
            margin-left: 260px;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            overflow-x: hidden;
        }
        .hgv-content {
            flex: 1;
            display: block;
            width: 100%;
        }
        @media (max-width: 991px) {
            .hgv-main { margin-left: 0; }
        }
    `]
})
export class AppLayout {}
