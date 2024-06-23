import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Response } from '../../interfaces/responses/response';
import {
  ChargePeriod,
  ChargePeriodForm,
} from '../../interfaces/charge-period/chargePeriod';

@Injectable({
  providedIn: 'root',
})
export class ChargePeriodService {
  readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.BASE_URL;

  getChargePeriod(): Observable<Response<ChargePeriod>> {
    return this.http.get<Response<ChargePeriod>>(
      `${this.BASE_URL}/upload-period`
    );
  }

  updateChargePeriod(
    chargePeriod: ChargePeriodForm
  ): Observable<Response<ChargePeriod>> {
    return this.http.put<Response<ChargePeriod>>(
      `${this.BASE_URL}/upload-period`,
      chargePeriod
    );
  }
}
