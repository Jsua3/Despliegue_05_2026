import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardSummaryResponse, ItemStatus } from '../../core/models/api.models';
import { StatusBadgeComponent } from '../../shared/status-badge/status-badge';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatusBadgeComponent],
  template: `
    <section class="space-y-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-sm font-bold uppercase tracking-wide text-emerald-700">Panel base</p>
          <h1 class="mt-1 text-3xl font-black text-stone-950">Dashboard</h1>
          <p class="mt-2 max-w-2xl text-sm text-stone-600">
            Resumen del flujo generico para adaptar a pedidos, citas, reservas, prestamos o solicitudes.
          </p>
        </div>
        <a routerLink="/items/nuevo"
           class="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-800">
          Crear item
        </a>
      </div>

      @if (summary(); as data) {
        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <p class="text-sm font-bold text-stone-500">Items</p>
            <p class="mt-2 text-4xl font-black text-stone-950">{{ data.totalItems }}</p>
          </div>
          <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <p class="text-sm font-bold text-stone-500">Catalogos activos</p>
            <p class="mt-2 text-4xl font-black text-stone-950">{{ data.catalogosActivos }}</p>
          </div>
          <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <p class="text-sm font-bold text-stone-500">Rol actual</p>
            <p class="mt-2 text-4xl font-black text-stone-950">{{ auth.currentUser()?.role }}</p>
          </div>
        </div>

        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h2 class="text-lg font-black text-stone-950">Estados del flujo</h2>
            @if (auth.isStaffOrAdmin()) {
              <a routerLink="/staff" class="text-sm font-black text-emerald-700 hover:text-emerald-900">Ir a staff</a>
            }
          </div>
          <div class="grid gap-3 md:grid-cols-5">
            @for (status of statuses; track status) {
              <div class="rounded-lg border border-stone-200 p-4">
                <app-status-badge [status]="status" />
                <p class="mt-3 text-3xl font-black text-stone-950">{{ data.itemsPorEstado[status] || 0 }}</p>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="rounded-lg border border-stone-200 bg-white p-6 text-sm font-semibold text-stone-600">
          Cargando resumen...
        </div>
      }
    </section>
  `
})
export class DashboardComponent implements OnInit {
  private readonly dashboard = inject(DashboardService);
  readonly auth = inject(AuthService);
  readonly summary = signal<DashboardSummaryResponse | null>(null);
  readonly statuses: ItemStatus[] = ['BORRADOR', 'ENVIADO', 'EN_REVISION', 'APROBADO', 'RECHAZADO'];

  ngOnInit(): void {
    this.dashboard.resumen().subscribe((summary) => this.summary.set(summary));
  }
}
