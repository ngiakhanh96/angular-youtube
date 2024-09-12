import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator } from '@ngrx/store';
import {
  catchError,
  filter,
  mergeMap,
  Observable,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  ActionForSuccessfulResponse,
  BaseActionGroup,
} from '../actions/common.action';
import { HttpResponseStatus } from '../models/http-response.model';

export abstract class BaseEffects {
  protected actions$ = inject(Actions);
  constructor(public actionsGroup: BaseActionGroup) {}

  protected createHttpEffectAndUpdateResponse<
    TActionCreator extends ActionCreator<string, Creator<any[], Action>>
  >(
    requestActionCreator: TActionCreator,
    callBackFn: (action: ReturnType<TActionCreator>) => Observable<Action>,
    showSpinner = true,
    actionForSuccessfulResponse: ActionForSuccessfulResponse
  ) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(requestActionCreator),
        switchMap((requestAction) => [
          this.actionsGroup.updateResponse({
            requestActionCreator: requestActionCreator,
            status: HttpResponseStatus.Pending,
            showSpinner: showSpinner,
          }),
          this.actionsGroup.cancelRequest({
            requestActionCreator: requestActionCreator,
          }),
          this.actionsGroup.sendingRequest({
            requestAction: requestAction,
            requestActionCreator: requestActionCreator,
            requestActionCallback: callBackFn as (
              action: Action
            ) => Observable<Action>,
            showSpinner: showSpinner,
            actionForSuccessfulResponse: actionForSuccessfulResponse,
          }),
        ])
      )
    );
  }

  readonly sendingRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(this.actionsGroup.sendingRequest),
      mergeMap((sendingRequestAction) =>
        sendingRequestAction
          .requestActionCallback(sendingRequestAction.requestAction)
          .pipe(
            switchMap((successAction) => {
              if (
                sendingRequestAction.actionForSuccessfulResponse ===
                ActionForSuccessfulResponse.DoNothing
              ) {
                return [successAction];
              }
              return [
                successAction,
                this.actionsGroup.updateResponse({
                  requestActionCreator:
                    sendingRequestAction.requestActionCreator,
                  status: HttpResponseStatus.Success,
                  showSpinner: sendingRequestAction.showSpinner,
                }),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                this.actionsGroup.updateResponse({
                  requestActionCreator:
                    sendingRequestAction.requestActionCreator,
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
                ofType(this.actionsGroup.cancelRequest),
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
}
