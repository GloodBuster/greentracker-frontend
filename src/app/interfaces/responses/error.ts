import { HttpErrorResponse } from "@angular/common/http";

export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface CustomHttpErrorResponse extends Omit<HttpErrorResponse, 'error'> {
    error: ErrorResponse;
  }
  