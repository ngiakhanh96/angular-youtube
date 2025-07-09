import { EventCreator, EventInstance, Events } from '@ngrx/signals/events';
import { Observable, switchMap } from 'rxjs';
import { HttpResponseStatus } from '../../../models/http-response/http-response.model';
import { IBaseState } from '../../../models/state';
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
    action: ReturnType<TEventCreator>,
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
          action: EventInstance<string, any>,
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
  observableFactory: (action: ReturnType<TEventCreator>) => Observable<TState>,
  callBackFn: (
    actionWithState: [ReturnType<TEventCreator>, TState],
  ) => Observable<EventInstance<string, any>>,
  showSpinner = true,
  eventForSuccessfulResponse: EventForSuccessfulResponse = EventForSuccessfulResponse.UpdateResponseAndHideSpinner,
) {
  return events.on(requestEventCreator).pipe(
    switchMap((requestActionWithState) => {
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
          requestEvent: requestActionWithState,
          requestEventCreator: requestEventCreator,
          requestEventCallBackWithState: callBackFn as (
            actionWithState: [EventInstance<string, any>, IBaseState],
          ) => Observable<EventInstance<string, any>>,
          showSpinner: showSpinner,
          eventForSuccessfulResponse: eventForSuccessfulResponse,
          observableFactory: observableFactory as (
            value: EventInstance<string, any>,
          ) => Observable<unknown>,
        }),
      ];
    }),
  );
}
