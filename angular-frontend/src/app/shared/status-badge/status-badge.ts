import { Component, computed, input } from '@angular/core';
import { ItemStatus, PedidoStatus } from '../../core/models/api.models';

type StatusValue = ItemStatus | PedidoStatus;

const statusClasses: Record<StatusValue, string> = {
  BORRADOR: 'bg-stone-100 text-stone-700 ring-stone-200',
  ENVIADO: 'bg-sky-100 text-sky-800 ring-sky-200',
  EN_REVISION: 'bg-amber-100 text-amber-800 ring-amber-200',
  APROBADO: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  RECHAZADO: 'bg-rose-100 text-rose-800 ring-rose-200',
  PENDIENTE: 'bg-amber-100 text-amber-800 ring-amber-200',
  CONFIRMADO: 'bg-sky-100 text-sky-800 ring-sky-200',
  ENTREGADO: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  CANCELADO: 'bg-rose-100 text-rose-800 ring-rose-200'
};

const statusLabels: Record<StatusValue, string> = {
  BORRADOR: 'Borrador',
  ENVIADO: 'Enviado',
  EN_REVISION: 'En revision',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado'
};

@Component({
  selector: 'app-status-badge',
  imports: [],
  template: `
    <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset" [class]="classes()">
      {{ label() }}
    </span>
  `
})
export class StatusBadgeComponent {
  readonly status = input.required<StatusValue>();
  readonly label = computed(() => statusLabels[this.status()]);
  readonly classes = computed(() => statusClasses[this.status()]);
}
