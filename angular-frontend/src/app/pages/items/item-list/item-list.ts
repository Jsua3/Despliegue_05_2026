import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemResponse, ItemStatus } from '../../../core/models/api.models';
import { ItemService } from '../../../core/services/item.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge';

type StatusFilter = ItemStatus | 'TODOS';

@Component({
  selector: 'app-item-list',
  imports: [DatePipe, RouterLink, StatusBadgeComponent],
  template: `
    <section class="space-y-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-emerald-700">Gestion principal</p>
          <h1 class="mt-1 text-3xl font-black text-stone-950">Items</h1>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <select [value]="filter()" (change)="setFilter($any($event.target).value)"
                  class="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700">
            <option value="TODOS">Todos</option>
            @for (status of statuses; track status) {
              <option [value]="status">{{ label(status) }}</option>
            }
          </select>
          <a routerLink="/items/nuevo"
             class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800">
            Nuevo
          </a>
        </div>
      </div>

      @if (filteredItems().length) {
        <div class="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft">
          <div class="hidden grid-cols-[1fr_150px_145px_110px] gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-stone-500 md:grid">
            <span>Item</span>
            <span>Catalogo</span>
            <span>Estado</span>
            <span>Accion</span>
          </div>
          @for (item of filteredItems(); track item.id) {
            <article class="grid gap-3 border-b border-stone-100 px-4 py-4 last:border-b-0 md:grid-cols-[1fr_150px_145px_110px] md:items-center">
              <div>
                <a [routerLink]="['/items', item.id]" class="font-black text-stone-950 hover:text-emerald-800">{{ item.titulo }}</a>
                <p class="mt-1 line-clamp-2 text-sm text-stone-600">{{ item.descripcion }}</p>
                <p class="mt-2 text-xs font-semibold text-stone-500">{{ item.createdAt | date:'short' }}</p>
              </div>
              <p class="text-sm font-bold text-stone-700">{{ item.catalogo.nombre }}</p>
              <app-status-badge [status]="item.status" />
              <div class="flex items-center gap-2">
                @if (item.status === 'BORRADOR') {
                  <button type="button" (click)="enviar(item)"
                          class="rounded-lg border border-emerald-300 px-3 py-2 text-sm font-black text-emerald-800 hover:bg-emerald-50">
                    Enviar
                  </button>
                } @else {
                  <a [routerLink]="['/items', item.id]" class="text-sm font-black text-emerald-700 hover:text-emerald-900">Ver</a>
                }
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-soft">
          <p class="font-black text-stone-950">No hay items para este filtro.</p>
          <a routerLink="/items/nuevo" class="mt-3 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800">
            Crear el primero
          </a>
        </div>
      }
    </section>
  `
})
export class ItemListComponent implements OnInit {
  private readonly itemService = inject(ItemService);
  readonly items = signal<ItemResponse[]>([]);
  readonly filter = signal<StatusFilter>('TODOS');
  readonly statuses: ItemStatus[] = ['BORRADOR', 'ENVIADO', 'EN_REVISION', 'APROBADO', 'RECHAZADO'];
  readonly filteredItems = computed(() => {
    const selected = this.filter();
    return selected === 'TODOS' ? this.items() : this.items().filter((item) => item.status === selected);
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.itemService.list().subscribe((items) => this.items.set(items));
  }

  enviar(item: ItemResponse): void {
    this.itemService.enviar(item.id).subscribe((updated) => {
      this.items.update((items) => items.map((current) => current.id === updated.id ? updated : current));
    });
  }

  setFilter(value: StatusFilter): void {
    this.filter.set(value);
  }

  label(status: ItemStatus): string {
    return status.replace('_', ' ');
  }
}
