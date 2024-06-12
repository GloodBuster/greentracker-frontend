import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import { Observable } from 'rxjs';
import { Categories, CategoriesForm } from '../../interfaces/categories/categories';
import { Indicator } from '../../interfaces/indicator/indicator';

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    readonly http = inject(HttpClient);
    private readonly BASE_URL = environment.BASE_URL;

    getAllIndicators(): Observable<PaginatedResponse<Indicator>> {
        return this.http.get<PaginatedResponse<Indicator>>(
          `${this.BASE_URL}/indicators`
        );
      }

    getCategoriesByIndex(
        indicatorIndex: number,
        page: number = 1,
        itemsPerPage: number = 10
    ): Observable<PaginatedResponse<Categories>> {
        return this.http.get<PaginatedResponse<Categories>>(
            `${this.BASE_URL}/indicators/${indicatorIndex}/categories?pageIndex=${page}&itemsPerPage=${itemsPerPage}`
        );
    }
    createCategory(
        indicatorIndex: number,
        category: CategoriesForm
    ): Observable<Response<Categories>> {
        return this.http.post<Response<Categories>>(
            `${this.BASE_URL}/indicators/${indicatorIndex}/categories`,
            { indicatorIndex, ...category }
        );
    }
    updateCategory(
        indicatorIndex: number,
        name: string,
        category: CategoriesForm
    ): Observable<Response<Categories>> {  
        return this.http.put<Response<Categories>>(
            `${this.BASE_URL}/indicators/${indicatorIndex}/categories/${name}`,
            { indicatorIndex, ...category }
        );
    }
    deleteCategory(
        indicatorIndex: number,
        name: string
    ): Observable<Response<Categories>> {
        return this.http.delete<Response<Categories>>(
            `${this.BASE_URL}/indicators/${indicatorIndex}/categories/${name}`
        );
    }
}