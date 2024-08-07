import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import {
  Indicator,
  IndicatorDetails,
  indicatorForm,
} from '../../interfaces/indicator/indicator';

@Injectable({
  providedIn: 'root',
})
export class IndicatorService {
  readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.BASE_URL;
  getIndicators(
    page: number = 1,
    itemsPerPage: number = 10
  ): Observable<PaginatedResponse<indicatorForm>> {
    return this.http.get<PaginatedResponse<indicatorForm>>(
      `${this.BASE_URL}/indicators?pageIndex=${page}&itemsPerPage=${itemsPerPage}`
    );
  }
  createIndicator(indicator: Indicator): Observable<Response<Indicator>> {
    return this.http.post<Response<Indicator>>(
      `${this.BASE_URL}/indicators`,
      indicator
    );
  }
  editIndicator(indicator: Indicator, index: number): Observable<Response<Indicator>> {
    return this.http.put<Response<Indicator>>(
      `${this.BASE_URL}/indicators/${index}`,
      indicator
    );
  }
  deleteIndicator(index: number): Observable<Response<Indicator>> {
    return this.http.delete<Response<Indicator>>(
      `${this.BASE_URL}/indicators/${index}`
    );
  }
  getAllIndicators(): Observable<Response<IndicatorDetails[]>> {
    return this.http.get<Response<IndicatorDetails[]>>(
      `${this.BASE_URL}/indicators/all`
    );
  }
  getCriterionReport(index: number, subindex: number): Observable<Blob> {
    return this.http.get(
      `${this.BASE_URL}/indicators/${index}/criteria/${subindex}/report`,
      {
        responseType: 'blob',
      }
    );
  }
}
