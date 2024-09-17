import { SpinnerService } from '@angular-youtube/shared-ui';
import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  Action,
  createSelector,
  MemoizedSelector,
  select,
  Store,
} from '@ngrx/store';
import { filter, Observable, Subscription } from 'rxjs';
import {
  getResponse,
  getResponseDetails,
} from '../store/base/selectors/base.selector';
import {
  HttpResponse,
  ResponseDetails,
} from '../store/models/http-response.model';
import { BaseState } from '../store/models/state.model';

@Injectable()
export abstract class BaseSandboxService<TState extends BaseState>
  implements OnDestroy
{
  public response$: Observable<HttpResponse>;
  protected store = inject(Store);
  protected getResponseSelector: MemoizedSelector<
    object,
    HttpResponse,
    (s1: TState) => HttpResponse
  >;
  private spinnerService = inject(SpinnerService);
  private subs: Subscription[] = [];
  constructor(protected getStateSelector: MemoizedSelector<object, TState>) {
    this.getResponseSelector = createSelector(
      this.getStateSelector,
      getResponse
    );
    this.response$ = this.store.pipe(select(this.getResponseSelector));
    this.subs.push(
      this.response$.pipe(filter((p) => p != null)).subscribe((response) => {
        if (response.isPendingCount > 0) {
          this.spinnerService.loadingOn();
        } else {
          this.spinnerService.loadingOff();
        }
      })
    );
  }

  getResponseDetailsSelector(action: Action) {
    return createSelector(this.getStateSelector, (state) =>
      getResponseDetails(state, action.type)
    );
  }

  getResponseDetails(action: Action): Observable<ResponseDetails> {
    return this.store.pipe(select(this.getResponseDetailsSelector(action)));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
