import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DashboardSummaryResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  resumen() {
    return this.http.get<DashboardSummaryResponse>(`${environment.apiUrl}/dashboard/resumen`);
  }
}
