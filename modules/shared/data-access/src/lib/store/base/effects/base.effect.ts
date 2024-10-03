import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  Actions,
  createEffect,
  CreateEffectMetadata,
  ofType,
} from '@ngrx/effects';
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
import {
  ActionForSuccessfulResponse,
  BaseActionGroup,
  UpdateResponseAction,
} from '../actions/base.action-group';

export abstract class BaseEffects<TActionGroup extends BaseActionGroup> {
  protected actions$ = inject(Actions);
  protected store = inject(Store);
  protected sendingRequest$: Observable<
    Action<string> | (UpdateResponseAction & Action<string>)
  > &
    CreateEffectMetadata;
  protected sendingRequestWithState$: Observable<
    Action<string> | (UpdateResponseAction & Action<string>)
  > &
    CreateEffectMetadata;
  constructor(protected actionsGroup: TActionGroup) {
    this.sendingRequest$ = this.sendingRequestFn();
    this.sendingRequestWithState$ = this.sendingRequestWithStateFn();
  }

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

  protected createHttpEffectWithStateAndUpdateResponse<
    TActionCreator extends ActionCreator<string, Creator<any[], Action>>,
    TState extends IBaseState
  >(
    requestActionCreator: TActionCreator,
    observableFactory: (
      action: ReturnType<TActionCreator>
    ) => Observable<TState>,
    callBackFn: (
      input: [ReturnType<TActionCreator>, TState]
    ) => Observable<Action>,
    showSpinner = true,
    actionForSuccessfulResponse: ActionForSuccessfulResponse = ActionForSuccessfulResponse.UpdateResponseAndHideSpinner
  ) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(requestActionCreator),
        switchMap((requestActionWithState) => {
          return [
            this.actionsGroup.updateResponse({
              requestActionCreator: requestActionCreator,
              status: HttpResponseStatus.Pending,
              showSpinner: showSpinner,
            }),
            this.actionsGroup.cancelRequest({
              requestActionCreator: requestActionCreator,
            }),
            this.actionsGroup.sendingRequest({
              requestAction: requestActionWithState,
              requestActionCreator: requestActionCreator,
              requestActionCallBackWithState: callBackFn as (
                input: [Action, IBaseState]
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
        ofType(this.actionsGroup.sendingRequest),
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
          );
        })
      )
    );

  private readonly sendingRequestFn = () =>
    createEffect(() =>
      this.actions$.pipe(
        ofType(this.actionsGroup.sendingRequest),
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
