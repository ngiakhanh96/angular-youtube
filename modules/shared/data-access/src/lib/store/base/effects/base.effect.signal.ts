import { EventCreator, EventInstance, Events } from '@ngrx/signals/events';
import { Observable, switchMap } from 'rxjs';
import { HttpResponseStatus } from '../../../models/http-response/http-response.model';
import {
  EventForSuccessfulResponse,
  sharedEventGroup,
} from '../actions/shared.event-group';

export function createHttpEffectAndUpdateResponse<
  TEventCreator extends EventCreator<string, any>,
>(
  events: Events,
  requestEventCreator: TEventCreator,
  callBackFn: (
    event: ReturnType<TEventCreator>,
  ) => Observable<EventInstance<string, any>>,
  showSpinner = true,
  eventForSuccessfulResponse: EventForSuccessfulResponse = EventForSuccessfulResponse.UpdateResponseAndHideSpinner,
) {
  return events.on(requestEventCreator).pipe(
    switchMap((requestEvent) => [
      sharedEventGroup.updateResponse({
        requestEventCreator: requestEventCreator,
        status: HttpResponseStatus.Pending,
        showSpinner: showSpinner,
      }),
      sharedEventGroup.cancelRequest({
        requestEventCreator: requestEventCreator,
      }),
      sharedEventGroup.sendingRequest({
        requestEvent: requestEvent,
        requestEventCreator: requestEventCreator,
        requestEventCallback: callBackFn as (
          event: EventInstance<string, any>,
        ) => Observable<EventInstance<string, any>>,
        showSpinner: showSpinner,
        eventForSuccessfulResponse: eventForSuccessfulResponse,
      }),
    ]),
  );
}

export function createHttpEffectWithStateAndUpdateResponse<
  TEventCreator extends EventCreator<string, any>,
  TState,
>(
  events: Events,
  requestEventCreator: TEventCreator,
  currentState: TState,
  callBackFn: (
    event: ReturnType<TEventCreator>,
    state: TState,
  ) => Observable<EventInstance<string, any>>,
  showSpinner = true,
  eventForSuccessfulResponse: EventForSuccessfulResponse = EventForSuccessfulResponse.UpdateResponseAndHideSpinner,
) {
  return events.on(requestEventCreator).pipe(
    switchMap((requestEventWithState) => {
      return [
        sharedEventGroup.updateResponse({
          requestEventCreator: requestEventCreator,
          status: HttpResponseStatus.Pending,
          showSpinner: showSpinner,
        }),
        sharedEventGroup.cancelRequest({
          requestEventCreator: requestEventCreator,
        }),
        sharedEventGroup.sendingRequestWithState({
          requestEvent: requestEventWithState,
          requestEventCreator: requestEventCreator,
          requestEventCallBackWithState: callBackFn as (
            event: EventInstance<string, any>,
            state: any,
          ) => Observable<EventInstance<string, any>>,
          showSpinner: showSpinner,
          eventForSuccessfulResponse: eventForSuccessfulResponse,
          currentState: currentState,
        }),
      ];
    }),
  );
}
