import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemResponse, ItemStatus } from '../../core/models/api.models';
import { ItemService } from '../../core/services/item.service';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';

type StaffFilter = ItemStatus | 'PENDIENTES' | 'TODOS';

@Component({
  selector: 'app-staff',
  imports: [DatePipe, FormsModule, RouterLink, StatusBadgeComponent],
  template: `
    <section class="space-y-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-emerald-700">Revision operativa</p>
          <h1 class="mt-1 text-3xl font-black text-stone-950">Panel staff/admin</h1>
          <p class="mt-2 text-sm text-stone-600">Aqui se pasan items a revision y se aprueban o rechazan.</p>
        </div>
        <select [value]="filter()" (change)="setFilter($any($event.target).value)"
                class="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700">
          <option value="PENDIENTES">Pendientes</option>
          <option value="TODOS">Todos</option>
          @for (status of statuses; track status) {
            <option [value]="status">{{ status.replace('_', ' ') }}</option>
          }
        </select>
      </div>

      <div class="grid gap-4">
        @for (item of visibleItems(); track item.id) {
          <article class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <a [routerLink]="['/items', item.id]" class="text-xl font-black text-stone-950 hover:text-emerald-800">{{ item.titulo }}</a>
                <p class="mt-1 text-sm font-semibold text-stone-500">
                  {{ item.catalogo.nombre }} · {{ item.createdBy.email }} · {{ item.createdAt | date:'short' }}
                </p>
              </div>
              <app-status-badge [status]="item.status" />
            </div>
            <p class="mt-3 text-sm text-stone-700">{{ item.descripcion }}</p>

            @if (item.status === 'ENVIADO' || item.status === 'EN_REVISION') {
              <textarea rows="2" [ngModel]="noteFor(item.id)" (ngModelChange)="setNote(item.id, $event)"
                        class="mt-4 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                        placeholder="Observaciones"></textarea>
            }

            <div class="mt-4 flex flex-wrap gap-2">
              @if (item.status === 'ENVIADO') {
                <button type="button" (click)="revisar(item)"
                        class="rounded-lg border border-amber-300 px-4 py-2 text-sm font-black text-amber-800 hover:bg-amber-50">
                  Pasar a revision
                </button>
              }
              @if (item.status === 'EN_REVISION') {
                <button type="button" (click)="aprobar(item)"
                        class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800">
                  Aprobar
                </button>
                <button type="button" (click)="rechazar(item)"
                        class="rounded-lg bg-rose-700 px-4 py-2 text-sm font-black text-white hover:bg-rose-800">
                  Rechazar
                </button>
              }
              <a [routerLink]="['/items', item.id]"
                 class="rounded-lg border border-stone-300 px-4 py-2 text-sm font-black text-stone-700 hover:bg-stone-100">
                Ver detalle
              </a>
            </div>
          </article>
        } @empty {
          <div class="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-soft">
            <p class="font-black text-stone-950">No hay items para revisar con este filtro.</p>
          </div>
        }
      </div>
    </section>
  `
})
export class StaffComponent implements OnInit {
  private readonly itemService = inject(ItemService);
  readonly items = signal<ItemResponse[]>([]);
  readonly notes = signal<Record<number, string>>({});
  readonly filter = signal<StaffFilter>('PENDIENTES');
  readonly statuses: ItemStatus[] = ['BORRADOR', 'ENVIADO', 'EN_REVISION', 'APROBADO', 'RECHAZADO'];
  readonly visibleItems = computed(() => {
    const selected = this.filter();
    if (selected === 'TODOS') {
      return this.items();
    }
    if (selected === 'PENDIENTES') {
      return this.items().filter((item) => item.status === 'ENVIADO' || item.status === 'EN_REVISION');
    }
    return this.items().filter((item) => item.status === selected);
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.itemService.list().subscribe((items) => this.items.set(items));
  }

  setFilter(value: StaffFilter): void {
    this.filter.set(value);
  }

  noteFor(id: number): string {
    return this.notes()[id] ?? '';
  }

  setNote(id: number, value: string): void {
    this.notes.update((notes) => ({ ...notes, [id]: value }));
  }

  revisar(item: ItemResponse): void {
    this.itemService.revisar(item.id, this.noteFor(item.id)).subscribe((updated) => this.replace(updated));
  }

  aprobar(item: ItemResponse): void {
    this.itemService.aprobar(item.id, this.noteFor(item.id)).subscribe((updated) => this.replace(updated));
  }

  rechazar(item: ItemResponse): void {
    this.itemService.rechazar(item.id, this.noteFor(item.id)).subscribe((updated) => this.replace(updated));
  }

  private replace(updated: ItemResponse): void {
    this.items.update((items) => items.map((item) => item.id === updated.id ? updated : item));
  }
}
