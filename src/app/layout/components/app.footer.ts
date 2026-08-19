import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: '[app-footer]',
    template: `
<footer class="flex items-center justify-between px-8 py-4 border-t border-outline-variant/30 bg-surface-container-lowest/80">
    <div class="flex items-center gap-3">
        <img src="/layout/images/Logo hotel.jpg" alt="Hotel Gran Vista" class="h-7 w-auto rounded object-contain" />
        <span class="text-sm font-semibold text-on-surface">Hotel Gran Vista</span>
    </div>
    <span class="text-xs text-on-surface-variant">© 2026 Hotel Gran Vista. Todos los derechos reservados.</span>
</footer>
    `
})
export class AppFooter {}
