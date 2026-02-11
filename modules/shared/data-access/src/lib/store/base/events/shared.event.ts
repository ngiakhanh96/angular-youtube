import { EventCreator, EventInstance } from '@ngrx/signals/events';
import { Observable } from 'rxjs';
import {
  HttpErrorResponseDetails,
  HttpResponseStatus,
} from '../../../models/http-response/http-response.model';

export interface UpdateResponseEvent {
  requestEventCreator: EventCreator<string, any>;
  status: HttpResponseStatus;
  errorResponse?: HttpErrorResponseDetails;
  showSpinner: boolean;
}

export interface SendingRequestEvent {
  requestEventCreator: EventCreator<string, any>;
  requestEvent: EventInstance<string, any>;
  requestEventCallback?: (
    event: EventInstance<string, any>,
  ) => Observable<EventInstance<string, any>>;
  requestEventCallBackWithState?: (
    event: EventInstance<string, any>,
    state: any,
  ) => Observable<EventInstance<string, any>>;
  showSpinner: boolean;
  eventForSuccessfulResponse: EventForSuccessfulResponse;
  currentState?: any;
}

export interface CancelRequestEvent {
  requestEventCreator: EventCreator<string, any>;
}

export enum EventForSuccessfulResponse {
  UpdateResponseAndHideSpinner = 'UpdateResponseAndHideSpinner',
  DoNothing = 'DoNothing',
}
