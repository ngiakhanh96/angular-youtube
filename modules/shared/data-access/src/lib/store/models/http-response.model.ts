import { HttpErrorResponse } from '@angular/common/http';

export enum HttpResponseStatus {
  Pending = 'Pending',
  Success = 'Success',
  Error = 'Error',
}

export interface HttpResponse {
  isPendingCount: number;
  details: ResponsesDetails;
}

export interface ResponseDetails {
  status: HttpResponseStatus;
  errorResponse: HttpErrorResponseDetails;
}
export type ResponsesDetails = { [actionName: string]: ResponseDetails };

export interface HttpErrorResponseDetails {
  actionName: string;
  errorInfo: HttpErrorResponse;
}
