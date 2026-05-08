import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogoResponse } from '../../../core/models/api.models';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { ItemService } from '../../../core/services/item.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-item-create',
  imports: [ReactiveFormsModule],
  template: `
    <section class="mx-auto max-w-3xl space-y-5">
      <div>
        <p class="text-sm font-bold uppercase tracking-wide text-emerald-700">Nuevo registro</p>
        <h1 class="mt-1 text-3xl font-black text-stone-950">Crear item</h1>
        <p class="mt-2 text-sm text-stone-600">Campos genericos para adaptar a la tematica en pocos minutos.</p>
      </div>

      @if (error()) {
        <div class="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {{ error() }}
        </div>
      }

      <form class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft" [formGroup]="form" (ngSubmit)="submit()">
        <div class="grid gap-4 md:grid-cols-2">
          <label class="block md:col-span-2">
            <span class="text-sm font-bold text-stone-700">Catalogo</span>
            <select formControlName="catalogoId"
                    class="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
              <option [ngValue]="null">Selecciona una opcion</option>
              @for (catalogo of catalogos(); track catalogo.id) {
                <option [ngValue]="catalogo.id">{{ catalogo.nombre }}</option>
              }
            </select>
          </label>

          <label class="block md:col-span-2">
            <span class="text-sm font-bold text-stone-700">Titulo</span>
            <input type="text" formControlName="titulo"
                   class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </label>

          <label class="block">
            <span class="text-sm font-bold text-stone-700">Solicitante</span>
            <input type="text" formControlName="solicitanteNombre"
                   class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </label>

          <label class="block">
            <span class="text-sm font-bold text-stone-700">Contacto</span>
            <input type="text" formControlName="contacto"
                   class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </label>

          <label class="block">
            <span class="text-sm font-bold text-stone-700">Cantidad</span>
            <input type="number" min="1" formControlName="cantidad"
                   class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </label>

          <label class="block">
            <span class="text-sm font-bold text-stone-700">Fecha objetivo</span>
            <input type="date" formControlName="fechaObjetivo"
                   class="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
          </label>

          <label class="block md:col-span-2">
            <span class="text-sm font-bold text-stone-700">Descripcion</span>
            <textarea rows="5" formControlName="descripcion"
                      class="mt-1 w-full resize-y rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"></textarea>
          </label>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button type="button" (click)="router.navigate(['/items'])"
                  class="rounded-lg border border-stone-300 px-4 py-2 text-sm font-black text-stone-700 hover:bg-stone-100">
            Cancelar
          </button>
          <button type="submit" [disabled]="form.invalid || loading()"
                  class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300">
            {{ loading() ? 'Guardando...' : 'Guardar borrador' }}
          </button>
        </div>
      </form>
    </section>
  `
})
export class ItemCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogoService = inject(CatalogoService);
  private readonly itemService = inject(ItemService);
  private readonly auth = inject(AuthService);
  readonly router = inject(Router);

  readonly catalogos = signal<CatalogoResponse[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly form = this.fb.group({
    catalogoId: this.fb.control<number | null>(null, [Validators.required]),
    titulo: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(120)]),
    descripcion: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(1200)]),
    solicitanteNombre: this.fb.nonNullable.control(this.auth.currentUser()?.nombre ?? '', [Validators.required]),
    contacto: this.fb.nonNullable.control(this.auth.currentUser()?.email ?? '', [Validators.required]),
    cantidad: this.fb.nonNullable.control(1, [Validators.required, Validators.min(1)]),
    fechaObjetivo: this.fb.control<string | null>(null)
  });

  ngOnInit(): void {
    this.catalogoService.list().subscribe((catalogos) => this.catalogos.set(catalogos));
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    if (!value.catalogoId) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.itemService.create({
      catalogoId: value.catalogoId,
      titulo: value.titulo,
      descripcion: value.descripcion,
      solicitanteNombre: value.solicitanteNombre,
      contacto: value.contacto,
      cantidad: value.cantidad,
      fechaObjetivo: value.fechaObjetivo
    }).subscribe({
      next: (item) => this.router.navigate(['/items', item.id]),
      error: () => {
        this.error.set('No se pudo crear el item.');
        this.loading.set(false);
      }
    });
  }
}
