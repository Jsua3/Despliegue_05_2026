import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProductoRequest, ProductoResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/productos`;

  list(incluirInactivos = false) {
    return this.http.get<ProductoResponse[]>(`${this.api}?incluirInactivos=${incluirInactivos}`);
  }

  get(id: number) {
    return this.http.get<ProductoResponse>(`${this.api}/${id}`);
  }

  create(payload: ProductoRequest) {
    return this.http.post<ProductoResponse>(this.api, payload);
  }

  update(id: number, payload: ProductoRequest) {
    return this.http.put<ProductoResponse>(`${this.api}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
