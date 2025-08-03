import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import {
  EventCreator,
  EventInstance,
  Events,
  withEffects,
} from '@ngrx/signals/events';
import {
  catchError,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { HttpResponseStatus } from '../../../models/http-response/http-response.model';
import { AuthHttpService } from '../../../services/http/auth.http.service';
import { YoutubeHttpService } from '../../../services/http/youtube.http.service';
import { SessionStorage } from '../../../services/session-storage.service';
import {
  EventForSuccessfulResponse,
  sharedEventGroup,
} from '../events/shared.event-group';
import { ISharedState } from '../reducers/shared.reducer';

export function withSharedEffects<_>() {
  return signalStoreFeature(
    { state: type<ISharedState>() },
    withEffects(
      (
        store,
        events = inject(Events),
        sessionStorageService = inject(SessionStorage),
        authHttpService = inject(AuthHttpService),
        youtubeService = inject(YoutubeHttpService),
      ) => ({
        sendingRequest$: events.on(sharedEventGroup.sendingRequest).pipe(
          mergeMap((sendingRequestEvent) =>
            sendingRequestEvent.payload.requestEventCallback!(
              sendingRequestEvent.payload.requestEvent,
            ).pipe(
              switchMap((successEvent) => {
                if (
                  sendingRequestEvent.payload.eventForSuccessfulResponse ===
                  EventForSuccessfulResponse.DoNothing
                ) {
                  return [successEvent];
                }
                return [
                  successEvent,
                  sharedEventGroup.updateResponse({
                    requestEventCreator:
                      sendingRequestEvent.payload.requestEventCreator,
                    status: HttpResponseStatus.Success,
                    showSpinner: sendingRequestEvent.payload.showSpinner,
                  }),
                ];
              }),
              catchError((error: HttpErrorResponse) => {
                return of(
                  sharedEventGroup.updateResponse({
                    requestEventCreator:
                      sendingRequestEvent.payload.requestEventCreator,
                    status: HttpResponseStatus.Error,
                    errorResponse: {
                      actionName:
                        sendingRequestEvent.payload.requestEventCreator.type,
                      errorInfo: error,
                    },
                    showSpinner: sendingRequestEvent.payload.showSpinner,
                  }),
                );
              }),
              takeUntil(
                events
                  .on(sharedEventGroup.cancelRequest)
                  .pipe(
                    filter(
                      (event) =>
                        event.payload.requestEventCreator ===
                        sendingRequestEvent.payload.requestEventCreator,
                    ),
                  ),
              ),
            ),
          ),
        ),
        updateAccessToken$: events.on(sharedEventGroup.updateAccessToken).pipe(
          map((event) => {
            if (event.payload.accessToken != null) {
              return sharedEventGroup.getAccessTokenInfo({
                accessToken: event.payload.accessToken,
              });
            }
            sessionStorageService.removeItem('Authorization');
            return sharedEventGroup.empty();
          }),
        ),
        getAccessTokenInfoSuccess$: events
          .on(sharedEventGroup.getAccessTokenInfoSuccess)
          .pipe(
            map((event) => {
              sessionStorageService.setItem(
                'Authorization',
                event.payload.accessToken,
              );
              return sharedEventGroup.updateAccessTokenSuccess({
                accessToken: event.payload.accessToken,
              });
            }),
          ),
        getAccessTokenInfo$: createHttpEffectAndUpdateResponse(
          events,
          sharedEventGroup.getAccessTokenInfo,
          (event) => {
            return authHttpService
              .getAccessTokenInfo(event.payload.accessToken)
              .pipe(
                map((accessTokenInfo) => {
                  const expiredDateTime = new Date();
                  expiredDateTime.setSeconds(
                    expiredDateTime.getSeconds() + +accessTokenInfo.expires_in,
                  );
                  return sharedEventGroup.getAccessTokenInfoSuccess({
                    accessTokenInfo: {
                      ...accessTokenInfo,
                      expired_datetime: expiredDateTime,
                    },
                    accessToken: event.payload.accessToken,
                  });
                }),
                catchError((err) => {
                  sessionStorageService.removeItem('Authorization');
                  return throwError(() => err);
                }),
              );
          },
          false,
        ),

        updateAccessTokenSuccess$: events
          .on(sharedEventGroup.updateAccessTokenSuccess)
          .pipe(
            map(() => {
              return sharedEventGroup.loadMyChannelInfo();
            }),
          ),

        loadYoutubeVideoCategories$: createHttpEffectAndUpdateResponse(
          events,
          sharedEventGroup.loadYoutubeVideoCategories,
          () => {
            return youtubeService.getVideoCategories().pipe(
              map((videoCategories) => {
                return sharedEventGroup.loadYoutubeVideoCategoriesSuccess({
                  videoCategories: videoCategories,
                });
              }),
            );
          },
          false,
        ),
        loadMyChannelInfo$: createHttpEffectAndUpdateResponse(
          events,
          sharedEventGroup.loadMyChannelInfo,
          () => {
            return youtubeService.getMyChannelInfo().pipe(
              map((myChannelInfo) => {
                return sharedEventGroup.loadMyChannelInfoSuccess({
                  myChannelInfo: myChannelInfo,
                });
              }),
            );
          },
          false,
        ),
      }),
    ),
  );
}

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
