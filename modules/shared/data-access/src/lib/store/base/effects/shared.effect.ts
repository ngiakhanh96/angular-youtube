import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
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
import { IBaseState } from '../../../models/state.model';
import { AuthHttpService } from '../../../services/http/auth.http.service';
import { SessionStorage } from '../../../services/session-storage.service';
import { ActionForSuccessfulResponse } from '../actions/base.action-group';
import { sharedActionGroup } from '../actions/shared.action-group';
import { BaseEffects } from './base.effect';

export class SharedEffects extends BaseEffects {
  private sessionStorageService = inject(SessionStorage);
  private authHttpService = inject(AuthHttpService);
  readonly sendingRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActionGroup.sendingRequest),
      mergeMap((sendingRequestAction) =>
        sendingRequestAction.requestActionCallback!(
          sendingRequestAction.requestAction,
        ).pipe(
          switchMap((successAction) => {
            if (
              sendingRequestAction.actionForSuccessfulResponse ===
              ActionForSuccessfulResponse.DoNothing
            ) {
              return [successAction];
            }
            return [
              successAction,
              sharedActionGroup.updateResponse({
                requestActionCreator: sendingRequestAction.requestActionCreator,
                status: HttpResponseStatus.Success,
                showSpinner: sendingRequestAction.showSpinner,
              }),
            ];
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              sharedActionGroup.updateResponse({
                requestActionCreator: sendingRequestAction.requestActionCreator,
                status: HttpResponseStatus.Error,
                errorResponse: {
                  actionName: sendingRequestAction.requestActionCreator.type,
                  errorInfo: error,
                },
                showSpinner: sendingRequestAction.showSpinner,
              }),
            );
          }),
          takeUntil(
            this.actions$.pipe(
              ofType(sharedActionGroup.cancelRequest),
              filter(
                (action) =>
                  action.requestActionCreator ===
                  sendingRequestAction.requestActionCreator,
              ),
            ),
          ),
        ),
      ),
    ),
  );

  readonly sendingRequestWithState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActionGroup.sendingRequestWithState),
      concatLatestFrom((sendingRequest) =>
        sendingRequest.observableFactory!(sendingRequest),
      ),
      mergeMap(([sendingRequestAction, state]) => {
        return sendingRequestAction.requestActionCallBackWithState!([
          sendingRequestAction.requestAction,
          state as IBaseState,
        ]).pipe(
          switchMap((successAction) => {
            if (
              sendingRequestAction.actionForSuccessfulResponse ===
              ActionForSuccessfulResponse.DoNothing
            ) {
              return [successAction];
            }
            return [
              successAction,
              sharedActionGroup.updateResponse({
                requestActionCreator: sendingRequestAction.requestActionCreator,
                status: HttpResponseStatus.Success,
                showSpinner: sendingRequestAction.showSpinner,
              }),
            ];
          }),
          catchError((error: HttpErrorResponse) => {
            return of(
              sharedActionGroup.updateResponse({
                requestActionCreator: sendingRequestAction.requestActionCreator,
                status: HttpResponseStatus.Error,
                errorResponse: {
                  actionName: sendingRequestAction.requestActionCreator.type,
                  errorInfo: error,
                },
                showSpinner: sendingRequestAction.showSpinner,
              }),
            );
          }),
          takeUntil(
            this.actions$.pipe(
              ofType(sharedActionGroup.cancelRequest),
              filter(
                (action) =>
                  action.requestActionCreator ===
                  sendingRequestAction.requestActionCreator,
              ),
            ),
          ),
        );
      }),
    ),
  );

  updateAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActionGroup.updateAccessToken),
      map((action) => {
        if (action.accessToken != null) {
          return sharedActionGroup.getAccessTokenInfo({
            accessToken: action.accessToken,
          });
        }
        this.sessionStorageService.removeItem('Authorization');
        return sharedActionGroup.empty();
      }),
    ),
  );

  getAccessTokenInfoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActionGroup.getAccessTokenInfoSuccess),
      map((action) => {
        this.sessionStorageService.setItem('Authorization', action.accessToken);
        return sharedActionGroup.updateAccessTokenSuccess({
          accessToken: action.accessToken,
        });
      }),
    ),
  );

  getAccessTokenInfo$ = this.createHttpEffectAndUpdateResponse(
    sharedActionGroup.getAccessTokenInfo,
    (action) => {
      return this.authHttpService.getAccessTokenInfo(action.accessToken).pipe(
        map((accessTokenInfo) => {
          const expiredDateTime = new Date();
          expiredDateTime.setSeconds(
            expiredDateTime.getSeconds() + +accessTokenInfo.expires_in,
          );
          return sharedActionGroup.getAccessTokenInfoSuccess({
            accessTokenInfo: {
              ...accessTokenInfo,
              expired_datetime: expiredDateTime,
            },
            accessToken: action.accessToken,
          });
        }),
        catchError((err) => {
          this.sessionStorageService.removeItem('Authorization');
          return throwError(() => err);
        }),
      );
    },
  );
}
