import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoResponse } from '../../../core/models/api.models';
import { ProductoService } from '../../../core/services/producto.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-item-detail',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="space-y-5">
      <a routerLink="/items" class="text-sm font-black text-red-700 hover:text-red-900">Volver a productos</a>

      @if (producto(); as data) {
        <div class="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <p class="text-sm font-bold uppercase tracking-wide text-red-700">{{ data.categoria }}</p>
            <h1 class="mt-1 text-3xl font-black text-stone-950">{{ data.nombre }}</h1>
            <p class="mt-3 text-stone-700">{{ data.descripcion }}</p>
            <dl class="mt-6 grid gap-3 sm:grid-cols-3">
              <div class="rounded-lg bg-stone-50 p-4">
                <dt class="text-xs font-black uppercase tracking-wide text-stone-500">Precio kg</dt>
                <dd class="mt-1 text-xl font-black text-red-700">{{ money(data.precioKg) }}</dd>
              </div>
              <div class="rounded-lg bg-stone-50 p-4">
                <dt class="text-xs font-black uppercase tracking-wide text-stone-500">Stock</dt>
                <dd class="mt-1 text-xl font-black text-stone-950">{{ data.stockKg }} kg</dd>
              </div>
              <div class="rounded-lg bg-stone-50 p-4">
                <dt class="text-xs font-black uppercase tracking-wide text-stone-500">Estado</dt>
                <dd class="mt-1 text-xl font-black text-stone-950">{{ data.activo ? 'Activo' : 'Inactivo' }}</dd>
              </div>
            </dl>
          </article>

          @if (!auth.isAdmin()) {
            <form class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft" [formGroup]="pedidoForm" (ngSubmit)="crearPedido(data)">
              <h2 class="text-xl font-black text-stone-950">Hacer pedido</h2>
              <p class="mt-1 text-sm text-stone-600">El pedido se guarda en el microservicio PostgreSQL.</p>
              <div class="mt-4 grid gap-4">
                <label class="block">
                  <span class="text-sm font-bold text-stone-700">Cantidad kg</span>
                  <input type="number" min="0.1" step="0.1" formControlName="cantidadKg" class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100">
                </label>
                <label class="block">
                  <span class="text-sm font-bold text-stone-700">Nombre cliente</span>
                  <input type="text" formControlName="clienteNombre" class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100">
                </label>
                <label class="block">
                  <span class="text-sm font-bold text-stone-700">Direccion entrega</span>
                  <input type="text" formControlName="direccionEntrega" class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100">
                </label>
                <label class="block">
                  <span class="text-sm font-bold text-stone-700">Observaciones</span>
                  <textarea rows="3" formControlName="observaciones" class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"></textarea>
                </label>
              </div>
              <button type="submit" [disabled]="pedidoForm.invalid || loading()" class="mt-4 w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-black text-white hover:bg-red-800 disabled:bg-stone-300">
                {{ loading() ? 'Enviando...' : 'Confirmar pedido' }}
              </button>
            </form>
          } @else {
            <form class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft" [formGroup]="adminForm" (ngSubmit)="actualizar(data.id)">
              <h2 class="text-xl font-black text-stone-950">Editar producto</h2>
              <div class="mt-4 grid gap-4">
                <input type="text" formControlName="nombre" class="rounded-lg border border-stone-300 px-3 py-2">
                <select formControlName="categoria" class="rounded-lg border border-stone-300 bg-white px-3 py-2">
                  <option value="Res">Res</option>
                  <option value="Cerdo">Cerdo</option>
                  <option value="Pollo">Pollo</option>
                  <option value="Embutidos">Embutidos</option>
                </select>
                <input type="number" formControlName="precioKg" class="rounded-lg border border-stone-300 px-3 py-2">
                <input type="number" formControlName="stockKg" class="rounded-lg border border-stone-300 px-3 py-2">
                <textarea rows="3" formControlName="descripcion" class="rounded-lg border border-stone-300 px-3 py-2"></textarea>
                <label class="flex items-center gap-2 text-sm font-bold text-stone-700">
                  <input type="checkbox" formControlName="activo">
                  Activo
                </label>
              </div>
              <button type="submit" [disabled]="adminForm.invalid || loading()" class="mt-4 w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-black text-white hover:bg-red-800 disabled:bg-stone-300">
                Guardar cambios
              </button>
            </form>
          }
        </div>
      } @else {
        <div class="rounded-lg border border-stone-200 bg-white p-6 text-sm font-semibold text-stone-600">Cargando producto...</div>
      }
    </section>
  `
})
export class ItemDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);
  private readonly pedidoService = inject(PedidoService);
  readonly auth = inject(AuthService);
  readonly producto = signal<ProductoResponse | null>(null);
  readonly loading = signal(false);

  readonly pedidoForm = this.fb.nonNullable.group({
    cantidadKg: [1, [Validators.required, Validators.min(0.1)]],
    clienteNombre: ['', [Validators.required]],
    direccionEntrega: ['', [Validators.required]],
    observaciones: ['']
  });

  readonly adminForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    categoria: ['Res', [Validators.required]],
    precioKg: [0, [Validators.required, Validators.min(1)]],
    stockKg: [0, [Validators.required, Validators.min(0)]],
    descripcion: ['', [Validators.required]],
    activo: [true]
  });

  ngOnInit(): void {
    this.pedidoForm.patchValue({ clienteNombre: this.auth.currentUser()?.nombre ?? '' });
    this.load();
  }

  load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.get(id).subscribe((producto) => {
      this.producto.set(producto);
      this.adminForm.patchValue(producto);
    });
  }

  crearPedido(producto: ProductoResponse): void {
    if (this.pedidoForm.invalid) {
      return;
    }
    this.loading.set(true);
    const value = this.pedidoForm.getRawValue();
    this.pedidoService.create({
      productoId: producto.id,
      productoNombre: producto.nombre,
      precioKg: producto.precioKg,
      cantidadKg: value.cantidadKg,
      clienteNombre: value.clienteNombre,
      direccionEntrega: value.direccionEntrega,
      observaciones: value.observaciones
    }).subscribe({
      next: () => this.router.navigate(['/staff']),
      error: () => this.loading.set(false)
    });
  }

  actualizar(id: number): void {
    if (this.adminForm.invalid) {
      return;
    }
    this.loading.set(true);
    this.productoService.update(id, this.adminForm.getRawValue()).subscribe({
      next: (producto) => {
        this.producto.set(producto);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  money(value: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  }
}
