import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoResponse } from '../../../core/models/api.models';
import { ProductoService } from '../../../core/services/producto.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-item-list',
  imports: [RouterLink],
  template: `
    <section class="space-y-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-red-700">Inventario</p>
          <h1 class="mt-1 text-3xl font-black text-stone-950">Productos carnicos</h1>
          <p class="mt-2 text-sm text-stone-600">CRUD de productos almacenado en MySQL.</p>
        </div>
        @if (auth.isAdmin()) {
          <a routerLink="/items/nuevo"
             class="rounded-lg bg-red-700 px-4 py-2 text-sm font-black text-white hover:bg-red-800">
            Nuevo producto
          </a>
        }
      </div>

      <div class="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <input type="search" [value]="search()" (input)="search.set($any($event.target).value)"
               placeholder="Buscar por nombre o categoria"
               class="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100">
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (producto of filteredProductos(); track producto.id) {
          <article class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-black uppercase tracking-wide text-red-700">{{ producto.categoria }}</p>
                <a [routerLink]="['/items', producto.id]" class="mt-1 block text-xl font-black text-stone-950 hover:text-red-800">
                  {{ producto.nombre }}
                </a>
              </div>
              <span class="rounded-md bg-stone-100 px-2 py-1 text-xs font-black text-stone-700">
                {{ producto.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>

            <p class="mt-3 line-clamp-3 text-sm text-stone-600">{{ producto.descripcion }}</p>
            <dl class="mt-4 grid grid-cols-2 gap-3">
              <div class="rounded-lg bg-stone-50 p-3">
                <dt class="text-xs font-black uppercase text-stone-500">Precio</dt>
                <dd class="font-black text-red-700">{{ money(producto.precioKg) }}/kg</dd>
              </div>
              <div class="rounded-lg bg-stone-50 p-3">
                <dt class="text-xs font-black uppercase text-stone-500">Stock</dt>
                <dd class="font-black text-stone-950">{{ producto.stockKg }} kg</dd>
              </div>
            </dl>

            <div class="mt-4 flex flex-wrap gap-2">
              <a [routerLink]="['/items', producto.id]"
                 class="rounded-lg border border-red-300 px-3 py-2 text-sm font-black text-red-800 hover:bg-red-50">
                {{ auth.isAdmin() ? 'Editar / ver' : 'Comprar' }}
              </a>
              @if (auth.isAdmin() && producto.activo) {
                <button type="button" (click)="delete(producto)"
                        class="rounded-lg border border-stone-300 px-3 py-2 text-sm font-black text-stone-700 hover:bg-stone-100">
                  Desactivar
                </button>
              }
            </div>
          </article>
        } @empty {
          <div class="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-soft md:col-span-2 xl:col-span-3">
            <p class="font-black text-stone-950">No hay productos para mostrar.</p>
          </div>
        }
      </div>
    </section>
  `
})
export class ItemListComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  readonly auth = inject(AuthService);
  readonly productos = signal<ProductoResponse[]>([]);
  readonly search = signal('');
  readonly filteredProductos = computed(() => {
    const value = this.search().toLowerCase().trim();
    if (!value) {
      return this.productos();
    }
    return this.productos().filter((producto) =>
      producto.nombre.toLowerCase().includes(value) || producto.categoria.toLowerCase().includes(value)
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productoService.list(this.auth.isAdmin()).subscribe((productos) => this.productos.set(productos));
  }

  delete(producto: ProductoResponse): void {
    this.productoService.delete(producto.id).subscribe(() => this.load());
  }

  money(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  }
}
