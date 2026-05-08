import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PedidoRequest, PedidoResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/pedidos`;

  list() {
    return this.http.get<PedidoResponse[]>(this.api);
  }

  create(payload: PedidoRequest) {
    return this.http.post<PedidoResponse>(this.api, payload);
  }

  confirmar(id: number) {
    return this.http.patch<PedidoResponse>(`${this.api}/${id}/confirmar`, {});
  }

  entregar(id: number) {
    return this.http.patch<PedidoResponse>(`${this.api}/${id}/entregar`, {});
  }

  cancelar(id: number) {
    return this.http.patch<PedidoResponse>(`${this.api}/${id}/cancelar`, {});
  }
}
