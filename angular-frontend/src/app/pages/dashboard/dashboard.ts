import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoResponse, PedidoResponse } from '../../core/models/api.models';
import { ProductoService } from '../../core/services/producto.service';
import { PedidoService } from '../../core/services/pedido.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatusBadgeComponent],
  template: `
    <section class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-red-700">Carniceria Buen Corte</p>
          <h1 class="mt-1 text-3xl font-black text-stone-950">Panel principal</h1>
          <p class="mt-2 max-w-2xl text-sm text-stone-600">
            Catalogo de carnes frescas en MySQL y pedidos en PostgreSQL mediante microservicios Docker.
          </p>
        </div>
        <a routerLink="/items"
           class="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-black text-white hover:bg-red-800">
          Ver productos
        </a>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <p class="text-sm font-bold text-stone-500">Productos activos</p>
          <p class="mt-2 text-4xl font-black text-stone-950">{{ productos().length }}</p>
        </div>
        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <p class="text-sm font-bold text-stone-500">Pedidos visibles</p>
          <p class="mt-2 text-4xl font-black text-stone-950">{{ pedidos().length }}</p>
        </div>
        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <p class="text-sm font-bold text-stone-500">Rol</p>
          <p class="mt-2 text-4xl font-black text-stone-950">{{ auth.currentUser()?.role }}</p>
        </div>
      </div>

      <div class="grid gap-5 lg:grid-cols-2">
        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-black text-stone-950">Productos destacados</h2>
            @if (auth.isAdmin()) {
              <a routerLink="/items/nuevo" class="text-sm font-black text-red-700 hover:text-red-900">Nuevo</a>
            }
          </div>
          <div class="space-y-3">
            @for (producto of productos().slice(0, 5); track producto.id) {
              <a [routerLink]="['/items', producto.id]" class="flex items-center justify-between rounded-lg border border-stone-200 p-3 hover:bg-stone-50">
                <span>
                  <span class="block font-black text-stone-950">{{ producto.nombre }}</span>
                  <span class="text-sm text-stone-500">{{ producto.categoria }}</span>
                </span>
                <span class="font-black text-red-700">{{ money(producto.precioKg) }}/kg</span>
              </a>
            }
          </div>
        </div>

        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-black text-stone-950">Pedidos recientes</h2>
            <a routerLink="/staff" class="text-sm font-black text-red-700 hover:text-red-900">Ver pedidos</a>
          </div>
          <div class="space-y-3">
            @for (pedido of pedidos().slice(0, 5); track pedido.id) {
              <div class="rounded-lg border border-stone-200 p-3">
                <div class="flex items-center justify-between gap-2">
                  <p class="font-black text-stone-950">{{ pedido.productoNombre }}</p>
                  <app-status-badge [status]="pedido.status" />
                </div>
                <p class="mt-1 text-sm text-stone-500">{{ pedido.cantidadKg }} kg · {{ money(pedido.total) }}</p>
              </div>
            } @empty {
              <p class="text-sm font-semibold text-stone-500">Aun no hay pedidos.</p>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class DashboardComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly pedidoService = inject(PedidoService);
  readonly auth = inject(AuthService);
  readonly productos = signal<ProductoResponse[]>([]);
  readonly pedidos = signal<PedidoResponse[]>([]);

  ngOnInit(): void {
    this.productoService.list(this.auth.isAdmin()).subscribe((productos) => this.productos.set(productos));
    this.pedidoService.list().subscribe((pedidos) => this.pedidos.set(pedidos));
  }

  money(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  }
}
