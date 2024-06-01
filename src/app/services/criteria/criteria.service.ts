import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import { Criterion } from '../../interfaces/criteria/criteria';
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

  addNewCriterion(criterion: Criterion): Observable<Response<Criterion>> {
    return this.http.post<Response<Criterion>>(
      `${this.BASE_URL}/indicators/${criterion.indicatorIndex}/criteria`,
      criterion
    );
  }
}
