import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItemResponse } from '../../../core/models/api.models';
import { ItemService } from '../../../core/services/item.service';
import { AuthService } from '../../../core/services/auth.service';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge';

@Component({
  selector: 'app-item-detail',
  imports: [DatePipe, FormsModule, RouterLink, StatusBadgeComponent],
  template: `
    <section class="space-y-5">
      <a routerLink="/items" class="text-sm font-black text-emerald-700 hover:text-emerald-900">Volver a items</a>

      @if (item(); as data) {
        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-sm font-bold uppercase tracking-wide text-emerald-700">{{ data.catalogo.nombre }}</p>
              <h1 class="mt-1 text-3xl font-black text-stone-950">{{ data.titulo }}</h1>
              <p class="mt-2 text-sm text-stone-500">Creado {{ data.createdAt | date:'medium' }}</p>
            </div>
            <app-status-badge [status]="data.status" />
          </div>

          <dl class="mt-6 grid gap-4 md:grid-cols-3">
            <div class="rounded-lg bg-stone-50 p-4">
              <dt class="text-xs font-black uppercase tracking-wide text-stone-500">Solicitante</dt>
              <dd class="mt-1 font-bold text-stone-900">{{ data.solicitanteNombre }}</dd>
            </div>
            <div class="rounded-lg bg-stone-50 p-4">
              <dt class="text-xs font-black uppercase tracking-wide text-stone-500">Contacto</dt>
              <dd class="mt-1 font-bold text-stone-900">{{ data.contacto }}</dd>
            </div>
            <div class="rounded-lg bg-stone-50 p-4">
              <dt class="text-xs font-black uppercase tracking-wide text-stone-500">Cantidad / fecha</dt>
              <dd class="mt-1 font-bold text-stone-900">{{ data.cantidad }} · {{ data.fechaObjetivo || 'Sin fecha' }}</dd>
            </div>
          </dl>

          <div class="mt-6">
            <h2 class="text-sm font-black uppercase tracking-wide text-stone-500">Descripcion</h2>
            <p class="mt-2 whitespace-pre-line text-stone-700">{{ data.descripcion }}</p>
          </div>

          @if (data.observacionesStaff) {
            <div class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h2 class="text-sm font-black uppercase tracking-wide text-amber-800">Observaciones</h2>
              <p class="mt-2 whitespace-pre-line text-amber-900">{{ data.observacionesStaff }}</p>
            </div>
          }

          <div class="mt-6 flex flex-wrap gap-2">
            @if (data.status === 'BORRADOR') {
              <button type="button" (click)="enviar()"
                      class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800">
                Enviar
              </button>
            }
          </div>
        </div>

        @if (auth.isStaffOrAdmin() && (data.status === 'ENVIADO' || data.status === 'EN_REVISION')) {
          <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <h2 class="text-lg font-black text-stone-950">Acciones staff</h2>
            <textarea rows="3" [ngModel]="observaciones()" (ngModelChange)="observaciones.set($event)"
                      class="mt-3 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Observaciones internas o respuesta visible"></textarea>
            <div class="mt-3 flex flex-wrap gap-2">
              @if (data.status === 'ENVIADO') {
                <button type="button" (click)="revisar()"
                        class="rounded-lg border border-amber-300 px-4 py-2 text-sm font-black text-amber-800 hover:bg-amber-50">
                  Pasar a revision
                </button>
              }
              @if (data.status === 'EN_REVISION') {
                <button type="button" (click)="aprobar()"
                        class="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-black text-white hover:bg-emerald-800">
                  Aprobar
                </button>
                <button type="button" (click)="rechazar()"
                        class="rounded-lg bg-rose-700 px-4 py-2 text-sm font-black text-white hover:bg-rose-800">
                  Rechazar
                </button>
              }
            </div>
          </div>
        }
      } @else {
        <div class="rounded-lg border border-stone-200 bg-white p-6 text-sm font-semibold text-stone-600">
          Cargando item...
        </div>
      }
    </section>
  `
})
export class ItemDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly itemService = inject(ItemService);
  readonly auth = inject(AuthService);

  readonly item = signal<ItemResponse | null>(null);
  readonly observaciones = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemService.get(id).subscribe((item) => {
      this.item.set(item);
      this.observaciones.set(item.observacionesStaff ?? '');
    });
  }

  enviar(): void {
    const current = this.item();
    if (!current) {
      return;
    }
    this.itemService.enviar(current.id).subscribe((item) => this.item.set(item));
  }

  revisar(): void {
    this.runStaffAction((id, obs) => this.itemService.revisar(id, obs));
  }

  aprobar(): void {
    this.runStaffAction((id, obs) => this.itemService.aprobar(id, obs));
  }

  rechazar(): void {
    this.runStaffAction((id, obs) => this.itemService.rechazar(id, obs));
  }

  private runStaffAction(action: (id: number, obs: string) => ReturnType<ItemService['revisar']>): void {
    const current = this.item();
    if (!current) {
      return;
    }
    action(current.id, this.observaciones()).subscribe((item) => this.item.set(item));
  }
}
