import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import { Observable } from 'rxjs';
import {
  UnitDetails,
  UnitsForm,
  UnitsGet,
  Indicators,
} from '../../interfaces/units/units';
import { Activity, Activity2 } from '../../interfaces/activities/activities';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.BASE_URL;

  getAllUnits(): Observable<Response<UnitDetails[]>> {
    return this.http.get<Response<UnitDetails[]>>(`${this.BASE_URL}/units/all`);
  }

  getUnits(
    page: number = 1,
    itemsPerPage: number = 10
  ): Observable<PaginatedResponse<UnitsGet>> {
    return this.http.get<PaginatedResponse<UnitsGet>>(
      `${this.BASE_URL}/units?pageIndex=${page}&itemsPerPage=${itemsPerPage}`
    );
  }

  addNewUnit(unit: UnitsForm): Observable<Response<UnitsForm>> {
    return this.http.post<Response<UnitsForm>>(`${this.BASE_URL}/units`, unit);
  }

  updateUnit(id: string, unit: UnitsForm): Observable<Response<UnitsForm>> {
    return this.http.put<Response<UnitsForm>>(
      `${this.BASE_URL}/units/${id}`,
      unit
    );
  }

  deleteUnit(id: string): Observable<Response<UnitsForm>> {
    return this.http.delete<Response<UnitsForm>>(
      `${this.BASE_URL}/units/${id}`
    );
  }
  getAllIndicators(): Observable<Response<Indicators[]>> {
    return this.http.get<Response<Indicators[]>>(
      `${this.BASE_URL}/indicators/all`
    );
  }
  getUnitById(id: string): Observable<Response<UnitDetails>> {
    return this.http.get<Response<UnitDetails>>(`${this.BASE_URL}/units/${id}`);
  }
  getNotifications(): Observable<Response<Activity2[]>> {
    return this.http.get<Response<Activity2[]>>(`${this.BASE_URL}/units/me/activities-feedbacks`);
  }
}
