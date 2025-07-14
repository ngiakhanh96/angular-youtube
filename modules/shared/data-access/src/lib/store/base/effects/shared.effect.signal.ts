import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { concatLatestFrom } from '@ngrx/operators';
import { signalStoreFeature } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { HttpResponseStatus } from '../../../models/http-response/http-response.model';
import { IBaseState } from '../../../models/state';
import { AuthHttpService } from '../../../services/http/auth.http.service';
import { YoutubeHttpService } from '../../../services/http/youtube.http.service';
import { SessionStorage } from '../../../services/session-storage.service';
import {
  EventForSuccessfulResponse,
  sharedEventGroup,
} from '../actions/shared.event-group';
import { createHttpEffectAndUpdateResponse } from './base.effect.signal';

export function withSharedEffects() {
  return signalStoreFeature(
    // ... other features
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
        sendingRequestWithState$: events
          .on(sharedEventGroup.sendingRequestWithState)
          .pipe(
            concatLatestFrom((sendingRequest) =>
              sendingRequest.payload.observableFactory!(sendingRequest),
            ),
            mergeMap(([sendingRequestAction, state]) => {
              return sendingRequestAction.payload
                .requestEventCallBackWithState!([
                sendingRequestAction.payload.requestEvent,
                state as IBaseState,
              ]).pipe(
                switchMap((successEvent) => {
                  if (
                    sendingRequestAction.payload.eventForSuccessfulResponse ===
                    EventForSuccessfulResponse.DoNothing
                  ) {
                    return [successEvent];
                  }
                  return [
                    successEvent,
                    sharedEventGroup.updateResponse({
                      requestEventCreator:
                        sendingRequestAction.payload.requestEventCreator,
                      status: HttpResponseStatus.Success,
                      showSpinner: sendingRequestAction.payload.showSpinner,
                    }),
                  ];
                }),
                catchError((error: HttpErrorResponse) => {
                  return of(
                    sharedEventGroup.updateResponse({
                      requestEventCreator:
                        sendingRequestAction.payload.requestEventCreator,
                      status: HttpResponseStatus.Error,
                      errorResponse: {
                        actionName:
                          sendingRequestAction.payload.requestEventCreator.type,
                        errorInfo: error,
                      },
                      showSpinner: sendingRequestAction.payload.showSpinner,
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
                          sendingRequestAction.payload.requestEventCreator,
                      ),
                    ),
                ),
              );
            }),
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
