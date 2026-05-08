import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PedidoResponse, PedidoStatus } from '../../core/models/api.models';
import { PedidoService } from '../../core/services/pedido.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';

type PedidoFilter = PedidoStatus | 'TODOS';

@Component({
  selector: 'app-staff',
  imports: [DatePipe, StatusBadgeComponent],
  template: `
    <section class="space-y-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-red-700">Microservicio PostgreSQL</p>
          <h1 class="mt-1 text-3xl font-black text-stone-950">{{ auth.isAdmin() ? 'Gestion de pedidos' : 'Mis pedidos' }}</h1>
          <p class="mt-2 text-sm text-stone-600">Los pedidos se persisten en PostgreSQL desde un microservicio independiente.</p>
        </div>
        <select [value]="filter()" (change)="setFilter($any($event.target).value)" class="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700">
          <option value="TODOS">Todos</option>
          @for (status of statuses; track status) {
            <option [value]="status">{{ status }}</option>
          }
        </select>
      </div>

      <div class="grid gap-4">
        @for (pedido of visiblePedidos(); track pedido.id) {
          <article class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 class="text-xl font-black text-stone-950">Pedido #{{ pedido.id }} · {{ pedido.productoNombre }}</h2>
                <p class="mt-1 text-sm font-semibold text-stone-500">
                  {{ pedido.clienteNombre }} · {{ pedido.clienteEmail }} · {{ pedido.createdAt | date:'short' }}
                </p>
              </div>
              <app-status-badge [status]="pedido.status" />
            </div>

            <dl class="mt-4 grid gap-3 md:grid-cols-4">
              <div class="rounded-lg bg-stone-50 p-3">
                <dt class="text-xs font-black uppercase text-stone-500">Cantidad</dt>
                <dd class="font-black text-stone-950">{{ pedido.cantidadKg }} kg</dd>
              </div>
              <div class="rounded-lg bg-stone-50 p-3">
                <dt class="text-xs font-black uppercase text-stone-500">Precio kg</dt>
                <dd class="font-black text-stone-950">{{ money(pedido.precioKg) }}</dd>
              </div>
              <div class="rounded-lg bg-stone-50 p-3">
                <dt class="text-xs font-black uppercase text-stone-500">Total</dt>
                <dd class="font-black text-red-700">{{ money(pedido.total) }}</dd>
              </div>
              <div class="rounded-lg bg-stone-50 p-3">
                <dt class="text-xs font-black uppercase text-stone-500">Entrega</dt>
                <dd class="font-black text-stone-950">{{ pedido.direccionEntrega }}</dd>
              </div>
            </dl>

            @if (pedido.observaciones) {
              <p class="mt-3 text-sm text-stone-600">{{ pedido.observaciones }}</p>
            }

            <div class="mt-4 flex flex-wrap gap-2">
              @if (auth.isAdmin() && pedido.status === 'PENDIENTE') {
                <button type="button" (click)="confirmar(pedido)" class="rounded-lg border border-sky-300 px-4 py-2 text-sm font-black text-sky-800 hover:bg-sky-50">Confirmar</button>
              }
              @if (auth.isAdmin() && pedido.status === 'CONFIRMADO') {
                <button type="button" (click)="entregar(pedido)" class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800">Entregar</button>
              }
              @if (pedido.status !== 'ENTREGADO' && pedido.status !== 'CANCELADO') {
                <button type="button" (click)="cancelar(pedido)" class="rounded-lg border border-rose-300 px-4 py-2 text-sm font-black text-rose-800 hover:bg-rose-50">Cancelar</button>
              }
            </div>
          </article>
        } @empty {
          <div class="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-soft">
            <p class="font-black text-stone-950">No hay pedidos para mostrar.</p>
          </div>
        }
      </div>
    </section>
  `
})
export class StaffComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  readonly auth = inject(AuthService);
  readonly pedidos = signal<PedidoResponse[]>([]);
  readonly filter = signal<PedidoFilter>('TODOS');
  readonly statuses: PedidoStatus[] = ['PENDIENTE', 'CONFIRMADO', 'ENTREGADO', 'CANCELADO'];
  readonly visiblePedidos = computed(() => {
    const selected = this.filter();
    return selected === 'TODOS' ? this.pedidos() : this.pedidos().filter((pedido) => pedido.status === selected);
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.pedidoService.list().subscribe((pedidos) => this.pedidos.set(pedidos));
  }

  setFilter(value: PedidoFilter): void {
    this.filter.set(value);
  }

  confirmar(pedido: PedidoResponse): void {
    this.pedidoService.confirmar(pedido.id).subscribe(() => this.load());
  }

  entregar(pedido: PedidoResponse): void {
    this.pedidoService.entregar(pedido.id).subscribe(() => this.load());
  }

  cancelar(pedido: PedidoResponse): void {
    this.pedidoService.cancelar(pedido.id).subscribe(() => this.load());
  }

  money(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  }
}
