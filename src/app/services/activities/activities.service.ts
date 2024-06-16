import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { PaginatedResponse } from "../../interfaces/responses/response";
import { Units } from "../../interfaces/activities/activities";

@Injectable({
    providedIn: 'root',
  })
  export class ActivitiesService {
    readonly http = inject(HttpClient);
    private readonly BASE_URL = environment.BASE_URL;

    getAllUnits(): Observable<PaginatedResponse<Units>> {
        return this.http.get<PaginatedResponse<Units>>(
          `${this.BASE_URL}/units`
        );
      }
  }