import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import { Observable } from 'rxjs';
import { Indicators, UnitsForm, UnitsGet } from '../../interfaces/units/units';

@Injectable({
    providedIn: 'root',
})
export class UnitsService{
    readonly http = inject(HttpClient);
    private readonly BASE_URL = environment.BASE_URL;

    getUnits(
        page: number = 1,
        itemsPerPage: number = 10
    ): Observable<PaginatedResponse<UnitsGet>> {
        return this.http.get<PaginatedResponse<UnitsGet>>(
            `${this.BASE_URL}/units?pageIndex=${page}&itemsPerPage=${itemsPerPage}`
        );
    }

    addNewUnit(
        unit: UnitsForm
    ): Observable<Response<UnitsForm>> {
        return this.http.post<Response<UnitsForm>>(
            `${this.BASE_URL}/units`,
            unit
        );
    }

    updateUnit(
        id: string,
        unit: UnitsForm
    ): Observable<Response<UnitsForm>> {
        return this.http.put<Response<UnitsForm>>(
            `${this.BASE_URL}/units/${id}`,
            unit
        );
    }

    deleteUnit(
        id: string
    ): Observable<Response<UnitsForm>> {
        return this.http.delete<Response<UnitsForm>>(
            `${this.BASE_URL}/units/${id}`
        );
    }

    getAllIndicators(): Observable<Response<Indicators[]>> {
        return this.http.get<Response<Indicators[]>>(
          `${this.BASE_URL}/indicators/all`
        );
    }

}