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
import { HttpResponse, ResponseDetails } from '../models/http-response.model';
import { IBaseState } from '../models/state.model';
import { selectSharedState } from '../store/base/reducers/shared.reducer';
import {
  getResponse,
  getResponseDetails,
} from '../store/base/selectors/base.selector';

@Injectable({
  providedIn: 'root',
})
export class SandboxService implements OnDestroy {
  public response$: Observable<HttpResponse>;
  public store = inject(Store);
  protected getResponseSelector: MemoizedSelector<
    object,
    HttpResponse,
    (s1: IBaseState) => HttpResponse
  >;
  private spinnerService = inject(SpinnerService);
  private subs: Subscription[] = [];
  constructor() {
    this.getResponseSelector = createSelector(selectSharedState, getResponse);
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
    return createSelector(selectSharedState, (state) =>
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
