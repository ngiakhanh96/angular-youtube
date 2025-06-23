import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator, Store } from '@ngrx/store';
import { Observable, OperatorFunction, switchMap } from 'rxjs';
import { HttpResponseStatus } from '../../../models/http-response/http-response.model';
import { IBaseState } from '../../../models/state';
import { ActionForSuccessfulResponse } from '../actions/base.action-group';
import { sharedActionGroup } from '../actions/shared.action-group';

export abstract class BaseEffects {
  protected actions$ = inject(Actions);
  protected store = inject(Store);

  protected createHttpEffectAndUpdateResponse<
    TActionCreator extends ActionCreator<string, Creator<any[], Action>>,
  >(
    requestActionCreator: TActionCreator,
    callBackFn: (action: ReturnType<TActionCreator>) => Observable<Action>,
    showSpinner = true,
    actionForSuccessfulResponse: ActionForSuccessfulResponse = ActionForSuccessfulResponse.UpdateResponseAndHideSpinner,
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
              action: Action,
            ) => Observable<Action>,
            showSpinner: showSpinner,
            actionForSuccessfulResponse: actionForSuccessfulResponse,
          }),
        ]),
      ),
    );
  }

  protected createHttpEffectWithStateAndUpdateResponse<
    TActionCreator extends ActionCreator<string, Creator<any[], Action>>,
    TState,
  >(
    requestActionCreator: TActionCreator,
    observableFactory: (
      action: ReturnType<TActionCreator>,
    ) => Observable<TState>,
    callBackFn: (
      actionWithState: [ReturnType<TActionCreator>, TState],
    ) => Observable<Action>,
    showSpinner = true,
    actionForSuccessfulResponse: ActionForSuccessfulResponse = ActionForSuccessfulResponse.UpdateResponseAndHideSpinner,
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
                actionWithState: [Action, IBaseState],
              ) => Observable<Action>,
              showSpinner: showSpinner,
              actionForSuccessfulResponse: actionForSuccessfulResponse,
              observableFactory: observableFactory as (
                value: Action,
              ) => Observable<unknown>,
            }),
          ];
        }),
      ),
    );
  }

  protected createEffect<
    TActionCreator extends ActionCreator<string, Creator<any[], Action>>,
  >(
    requestActionCreator: TActionCreator,
    operator: OperatorFunction<ReturnType<TActionCreator>, Action>,
  ) {
    return createEffect(() =>
      this.actions$.pipe(ofType(requestActionCreator), operator),
    );
  }
}
