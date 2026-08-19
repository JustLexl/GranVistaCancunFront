import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

interface Breadcrumb {
    label: string;
    url?: string;
}

@Component({
    selector: '[app-breadcrumb]',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
<nav class="flex items-center gap-1 text-xs text-on-surface-variant px-8 pt-5 pb-1">
    <a [routerLink]="['/Inicio/GestionHabitaciones']"
       class="flex items-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
        <span class="material-symbols-outlined text-sm">home</span>
    </a>
    <ng-template ngFor let-item let-last="last" [ngForOf]="breadcrumbs$ | async">
        <span class="material-symbols-outlined text-sm text-outline">chevron_right</span>
        <span [class]="last ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary cursor-pointer'">
            {{ item.label }}
        </span>
    </ng-template>
</nav>
    `
})
export class AppBreadcrumb {
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const root = this.router.routerState.snapshot.root;
                const breadcrumbs: Breadcrumb[] = [];
                this.addBreadcrumb(root, [], breadcrumbs);
                this._breadcrumbs$.next(breadcrumbs);
            });
    }

    private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
        const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
        const breadcrumb = route.data['breadcrumb'];
        const parentBreadcrumb = route.parent && route.parent.data ? route.parent.data['breadcrumb'] : null;

        if (breadcrumb && breadcrumb !== parentBreadcrumb) {
            breadcrumbs.push({ label: route.data['breadcrumb'], url: '/' + routeUrl.join('/') });
        }

        if (route.firstChild) {
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
        }
    }
}
