import { HttpErrorResponse } from '@angular/common/http';
import { createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { catchError, filter, mergeMap, of, switchMap, takeUntil } from 'rxjs';
import { HttpResponseStatus } from '../../../models/http-response.model';
import { IBaseState } from '../../../models/state.model';
import { ActionForSuccessfulResponse } from '../actions/base.action-group';
import { sharedActionGroup } from '../actions/shared.action-group';
import { BaseEffects } from './base.effect';

export class SharedEffects extends BaseEffects {
  readonly sendingRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActionGroup.sendingRequest),
      mergeMap((sendingRequestAction) =>
        sendingRequestAction.requestActionCallback!(
          sendingRequestAction.requestAction
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
              })
            );
          }),
          takeUntil(
            this.actions$.pipe(
              ofType(sharedActionGroup.cancelRequest),
              filter(
                (action) =>
                  action.requestActionCreator ===
                  sendingRequestAction.requestActionCreator
              )
            )
          )
        )
      )
    )
  );

  readonly sendingRequestWithState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sharedActionGroup.sendingRequestWithState),
      concatLatestFrom((sendingRequest) =>
        sendingRequest.observableFactory!(sendingRequest)
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
              })
            );
          }),
          takeUntil(
            this.actions$.pipe(
              ofType(sharedActionGroup.cancelRequest),
              filter(
                (action) =>
                  action.requestActionCreator ===
                  sendingRequestAction.requestActionCreator
              )
            )
          )
        );
      })
    )
  );
}
