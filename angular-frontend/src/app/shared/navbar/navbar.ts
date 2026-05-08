import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <a routerLink="/" class="flex items-center gap-3">
          <span class="grid size-9 place-items-center rounded-lg bg-red-700 text-sm font-black text-white">CB</span>
          <span>
            <span class="block text-sm font-black uppercase tracking-wide text-stone-900">Carniceria Buen Corte</span>
            <span class="block text-xs text-stone-500">Productos frescos y pedidos</span>
          </span>
        </a>

        <div class="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <a routerLink="/" routerLinkActive="bg-stone-100 text-stone-950" [routerLinkActiveOptions]="{ exact: true }"
             class="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-950">Dashboard</a>
          <a routerLink="/items" routerLinkActive="bg-stone-100 text-stone-950"
             class="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-950">Productos</a>
          @if (auth.isAdmin()) {
            <a routerLink="/items/nuevo" routerLinkActive="bg-stone-100 text-stone-950"
               class="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-950">Nuevo producto</a>
          }
            <a routerLink="/staff" routerLinkActive="bg-stone-100 text-stone-950"
               class="rounded-lg px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-950">Pedidos</a>
        </div>

        <div class="flex items-center gap-3">
          @if (auth.currentUser(); as user) {
            <div class="hidden text-right sm:block">
              <p class="text-sm font-bold text-stone-900">{{ user.nombre }}</p>
              <p class="text-xs text-stone-500">{{ user.role }}</p>
            </div>
          }
          <button type="button" (click)="auth.logout()"
                  class="rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100">
            Salir
          </button>
        </div>
      </nav>
    </header>
  `
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
}
