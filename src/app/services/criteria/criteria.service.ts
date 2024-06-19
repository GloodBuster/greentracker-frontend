import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import { Criterion, CriterionForm } from '../../interfaces/criteria/criteria';
import { Observable } from 'rxjs';
import { Indicator } from '../../interfaces/indicator/indicator';

@Injectable({
  providedIn: 'root',
})
export class CriteriaService {
  readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.BASE_URL;

  getAllIndicators(): Observable<Response<Indicator[]>> {
    return this.http.get<Response<Indicator[]>>(
      `${this.BASE_URL}/indicators/all`
    );
  }

  getCriteriaByIndex(
    indicatorIndex: number,
    page: number = 1,
    itemsPerPage: number = 10
  ): Observable<PaginatedResponse<Criterion>> {
    return this.http.get<PaginatedResponse<Criterion>>(
      `${this.BASE_URL}/indicators/${indicatorIndex}/criteria?pageIndex=${page}&itemsPerPage=${itemsPerPage}`
    );
  }

  addNewCriterion(
    indicatorIndex: number,
    criterion: CriterionForm
  ): Observable<Response<Criterion>> {
    return this.http.post<Response<Criterion>>(
      `${this.BASE_URL}/indicators/${indicatorIndex}/criteria`,
      { indicatorIndex, ...criterion }
    );
  }

  updateCriterion(
    indicatorIndex: number,
    subindex: number,
    criterion: CriterionForm
  ): Observable<Response<Criterion>> {
    return this.http.put<Response<Criterion>>(
      `${this.BASE_URL}/indicators/${indicatorIndex}/criteria/${subindex}`,
      { indicatorIndex, ...criterion }
    );
  }

  deleteCriterion(
    indicatorIndex: number,
    subindex: number
  ): Observable<Response<Criterion>> {
    return this.http.delete<Response<Criterion>>(
      `${this.BASE_URL}/indicators/${indicatorIndex}/criteria/${subindex}`
    );
  }
}
