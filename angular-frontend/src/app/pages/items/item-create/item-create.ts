import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto.service';

@Component({
  selector: 'app-item-create',
  imports: [ReactiveFormsModule],
  template: `
    <section class="mx-auto max-w-3xl space-y-5">
      <div>
        <p class="text-sm font-bold uppercase tracking-wide text-red-700">Administracion</p>
        <h1 class="mt-1 text-3xl font-black text-stone-950">Nuevo producto</h1>
        <p class="mt-2 text-sm text-stone-600">Crea cortes, embutidos o productos vendidos por kilogramo.</p>
      </div>

      @if (error()) {
        <div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{{ error() }}</div>
      }

      <form class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft" [formGroup]="form" (ngSubmit)="submit()">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="block">
            <span class="text-sm font-bold text-stone-700">Nombre</span>
            <input type="text" formControlName="nombre" class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100">
          </label>
          <label class="block">
            <span class="text-sm font-bold text-stone-700">Categoria</span>
            <select formControlName="categoria" class="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100">
              <option value="Res">Res</option>
              <option value="Cerdo">Cerdo</option>
              <option value="Pollo">Pollo</option>
              <option value="Embutidos">Embutidos</option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm font-bold text-stone-700">Precio por kg</span>
            <input type="number" min="1" formControlName="precioKg" class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100">
          </label>
          <label class="block">
            <span class="text-sm font-bold text-stone-700">Stock kg</span>
            <input type="number" min="0" step="0.1" formControlName="stockKg" class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100">
          </label>
          <label class="block md:col-span-2">
            <span class="text-sm font-bold text-stone-700">Descripcion</span>
            <textarea rows="4" formControlName="descripcion" class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100"></textarea>
          </label>
          <label class="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" formControlName="activo" class="size-4 rounded border-stone-300 text-red-700">
            <span class="text-sm font-bold text-stone-700">Activo para venta</span>
          </label>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button type="button" (click)="router.navigate(['/items'])" class="rounded-lg border border-stone-300 px-4 py-2 text-sm font-black text-stone-700 hover:bg-stone-100">Cancelar</button>
          <button type="submit" [disabled]="form.invalid || loading()" class="rounded-lg bg-red-700 px-4 py-2 text-sm font-black text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-stone-300">
            {{ loading() ? 'Guardando...' : 'Guardar producto' }}
          </button>
        </div>
      </form>
    </section>
  `
})
export class ItemCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);
  readonly router = inject(Router);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    categoria: ['Res', [Validators.required]],
    precioKg: [10000, [Validators.required, Validators.min(1)]],
    stockKg: [10, [Validators.required, Validators.min(0)]],
    descripcion: ['', [Validators.required, Validators.maxLength(700)]],
    activo: [true]
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.productoService.create(this.form.getRawValue()).subscribe({
      next: (producto) => this.router.navigate(['/items', producto.id]),
      error: () => {
        this.error.set('No se pudo crear el producto.');
        this.loading.set(false);
      }
    });
  }
}
