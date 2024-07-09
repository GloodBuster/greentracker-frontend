import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  PaginatedResponse,
  Response,
} from '../../interfaces/responses/response';
import {
  Activity,
  ActivityForm,
  UnitActivity,
  Units,
} from '../../interfaces/activities/activities';

type ActivitiesFilters = {
  pageIndex?: number;
  itemsPerPage?: number;
  id?: string;
  name?: string;
  summary?: string;
  uploadTimestamp?: string;
  unitId?: string;
  indicatorIndex?: number;
  categoryName?: string;
};

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.BASE_URL;

  getFilteredActivities({
    pageIndex,
    itemsPerPage,
    id,
    name,
    summary,
    uploadTimestamp,
    unitId,
    indicatorIndex,
    categoryName,
  }: ActivitiesFilters): Observable<PaginatedResponse<Activity>> {
    let params = new HttpParams();
    if (pageIndex) {
      params = params.set('pageIndex', pageIndex.toString());
    }
    if (itemsPerPage) {
      params = params.set('itemsPerPage', itemsPerPage.toString());
    }
    if (id) {
      params = params.set('id', id);
    }
    if (name) {
      params = params.set('name', name);
    }
    if (summary) {
      params = params.set('summary', summary);
    }
    if (uploadTimestamp) {
      params = params.set('uploadTimestamp', uploadTimestamp);
    }
    if (unitId) {
      params = params.set('unitId', unitId);
    }
    if (indicatorIndex) {
      params = params.set('indicatorIndex', indicatorIndex.toString());
    }
    if (categoryName) {
      params = params.set('categoryName', categoryName);
    }
    return this.http.get<PaginatedResponse<Activity>>(
      `${this.BASE_URL}/activities`,
      { params }
    );
  }

  getAllUnits(): Observable<PaginatedResponse<Units>> {
    return this.http.get<PaginatedResponse<Units>>(`${this.BASE_URL}/units`);
  }

  getActivityById(id: string): Observable<Response<Activity>> {
    return this.http.get<Response<Activity>>(
      `${this.BASE_URL}/activities/${id}`
    );
  }

  createActivity(activity: ActivityForm): Observable<Response<Activity>> {
    return this.http.post<Response<Activity>>(
      `${this.BASE_URL}/activities`,
      activity
    );
  }

  updateActivity(
    activityId: string,
    activity: ActivityForm
  ): Observable<Response<Activity>> {
    return this.http.put<Response<Activity>>(
      `${this.BASE_URL}/activities/${activityId}`,
      activity
    );
  }

  deleteActivity(activityId: string): Observable<Response<Activity>> {
    return this.http.delete<Response<Activity>>(
      `${this.BASE_URL}/activities/${activityId}`
    );
  }
}
