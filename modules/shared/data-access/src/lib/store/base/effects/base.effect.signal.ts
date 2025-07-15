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
  requestEventCallback: (
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
        requestEventCallback: requestEventCallback as (
          event: EventInstance<string, any>,
        ) => Observable<EventInstance<string, any>>,
        showSpinner: showSpinner,
        eventForSuccessfulResponse: eventForSuccessfulResponse,
      }),
    ]),
  );
}
