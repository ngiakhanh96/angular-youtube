import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, ActionCreator, Creator, Store } from '@ngrx/store';
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
import { IBaseState } from '../../../models/state.model';
import { ActionForSuccessfulResponse } from '../actions/base.action-group';
import { sharedActionGroup } from '../actions/shared.action-group';

export abstract class BaseEffects {
  protected actions$ = inject(Actions);
  protected store = inject(Store);

  protected createHttpEffectAndUpdateResponse<
    TActionCreator extends ActionCreator<string, Creator<any[], Action>>
  >(
    requestActionCreator: TActionCreator,
    callBackFn: (action: ReturnType<TActionCreator>) => Observable<Action>,
    showSpinner = true,
    actionForSuccessfulResponse: ActionForSuccessfulResponse = ActionForSuccessfulResponse.UpdateResponseAndHideSpinner
  ) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(requestActionCreator),
        switchMap((requestAction) => [
          sharedActionGroup.updateResponse({
            requestActionCreator: requestActionCreator,
            status: HttpResponseStatus.Pending,
            showSpinner: showSpinner,
          }),
          sharedActionGroup.cancelRequest({
            requestActionCreator: requestActionCreator,
          }),
          sharedActionGroup.sendingRequest({
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

  protected createHttpEffectWithStateAndUpdateResponse<
    TActionCreator extends ActionCreator<string, Creator<any[], Action>>,
    TState extends IBaseState
  >(
    requestActionCreator: TActionCreator,
    observableFactory: (
      action: ReturnType<TActionCreator>
    ) => Observable<TState>,
    callBackFn: (
      actionWithState: [ReturnType<TActionCreator>, TState]
    ) => Observable<Action>,
    showSpinner = true,
    actionForSuccessfulResponse: ActionForSuccessfulResponse = ActionForSuccessfulResponse.UpdateResponseAndHideSpinner
  ) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(requestActionCreator),
        switchMap((requestActionWithState) => {
          return [
            sharedActionGroup.updateResponse({
              requestActionCreator: requestActionCreator,
              status: HttpResponseStatus.Pending,
              showSpinner: showSpinner,
            }),
            sharedActionGroup.cancelRequest({
              requestActionCreator: requestActionCreator,
            }),
            sharedActionGroup.sendingRequestWithState({
              requestAction: requestActionWithState,
              requestActionCreator: requestActionCreator,
              requestActionCallBackWithState: callBackFn as (
                actionWithState: [Action, IBaseState]
              ) => Observable<Action>,
              showSpinner: showSpinner,
              actionForSuccessfulResponse: actionForSuccessfulResponse,
              observableFactory: observableFactory as (
                value: Action
              ) => Observable<unknown>,
            }),
          ];
        })
      )
    );
  }

  private readonly sendingRequestWithStateFn = () =>
    createEffect(() =>
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
                  requestActionCreator:
                    sendingRequestAction.requestActionCreator,
                  status: HttpResponseStatus.Success,
                  showSpinner: sendingRequestAction.showSpinner,
                }),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                sharedActionGroup.updateResponse({
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

  private readonly sendingRequestFn = () =>
    createEffect(() =>
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
                  requestActionCreator:
                    sendingRequestAction.requestActionCreator,
                  status: HttpResponseStatus.Success,
                  showSpinner: sendingRequestAction.showSpinner,
                }),
              ];
            }),
            catchError((error: HttpErrorResponse) => {
              return of(
                sharedActionGroup.updateResponse({
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
}
