import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  Actions,
  createEffect,
  CreateEffectMetadata,
  ofType,
} from '@ngrx/effects';
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
import { HttpResponseStatus } from '../../../models/http-response.model';
import {
  ActionForSuccessfulResponse,
  BaseActionGroup,
  UpdateResponseAction,
} from '../actions/base.action-group';

export abstract class BaseEffects<TActionGroup extends BaseActionGroup> {
  protected actions$ = inject(Actions);
  protected sendingRequest$: Observable<
    Action<string> | (UpdateResponseAction & Action<string>)
  > &
    CreateEffectMetadata;
  constructor(protected actionsGroup: TActionGroup) {
    this.sendingRequest$ = this.sendingRequestFn();
  }

  protected createHttpEffectAndUpdateResponse<
    TActionCreator extends ActionCreator<string, Creator<unknown[], Action>>
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

  private readonly sendingRequestFn = () =>
    createEffect(() =>
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
                      actionName:
                        sendingRequestAction.requestActionCreator.type,
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
