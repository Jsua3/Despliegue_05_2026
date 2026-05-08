import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ItemCreateRequest, ItemResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/items`;

  list() {
    return this.http.get<ItemResponse[]>(this.api);
  }

  get(id: number) {
    return this.http.get<ItemResponse>(`${this.api}/${id}`);
  }

  create(payload: ItemCreateRequest) {
    return this.http.post<ItemResponse>(this.api, payload);
  }

  enviar(id: number) {
    return this.http.patch<ItemResponse>(`${this.api}/${id}/enviar`, {});
  }

  revisar(id: number, observaciones?: string) {
    return this.http.patch<ItemResponse>(`${this.api}/${id}/revisar`, { observaciones });
  }

  aprobar(id: number, observaciones?: string) {
    return this.http.patch<ItemResponse>(`${this.api}/${id}/aprobar`, { observaciones });
  }

  rechazar(id: number, observaciones?: string) {
    return this.http.patch<ItemResponse>(`${this.api}/${id}/rechazar`, { observaciones });
  }
}
