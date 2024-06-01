import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import { Criterion, CriterionForm } from '../../interfaces/criteria/criteria';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CriteriaService {
  readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.BASE_URL;

  getCriteriaByIndex(
    indicatorIndex: number
  ): Observable<PaginatedResponse<Criterion>> {
    return this.http.get<PaginatedResponse<Criterion>>(
      `${this.BASE_URL}/indicators/${indicatorIndex}/criteria`
    );
  }

  addNewCriterion(
    indicatorIndex: number,
    criterion: CriterionForm
  ): Observable<Response<Criterion>> {
    return this.http.post<Response<Criterion>>(
      `${this.BASE_URL}/indicators/${indicatorIndex}/criteria`,
      criterion
    );
  }

  updateCriterion(
    indicatorIndex: number,
    subindex: number,
    criterion: CriterionForm
  ): Observable<Response<Criterion>> {
    return this.http.put<Response<Criterion>>(
      `${this.BASE_URL}/indicators/${indicatorIndex}/criteria/${subindex}`,
      criterion
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
