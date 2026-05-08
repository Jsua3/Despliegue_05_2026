import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CatalogoResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/catalogos`;

  list() {
    return this.http.get<CatalogoResponse[]>(this.api);
  }

  get(id: number) {
    return this.http.get<CatalogoResponse>(`${this.api}/${id}`);
  }
}
