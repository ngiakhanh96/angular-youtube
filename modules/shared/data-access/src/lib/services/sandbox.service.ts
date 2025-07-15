import { effect, inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { Dispatcher, EventInstance } from '@ngrx/signals/events';
import {
  Action,
  createSelector,
  MemoizedSelector,
  select,
  Store,
} from '@ngrx/store';
import { filter, Observable, Subscription } from 'rxjs';
import { HttpResponse } from '../models/http-response/http-response.model';
import {
  ISharedState,
  selectSharedState,
} from '../store/base/reducers/shared.reducer';
import { SharedStore } from '../store/base/reducers/shared.reducer.signal';
import {
  getResponse,
  getResponseDetails,
} from '../store/base/selectors/base.selector';
import { ResponseDetails } from './../models/http-response/http-response.model';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root',
})
export class SandboxService implements OnDestroy {
  public response$: Observable<HttpResponse>;
  public store = inject(Store);
  public sharedStore = inject(SharedStore);
  protected injector = inject(Injector);
  protected dispatcher = inject(Dispatcher);
  protected getResponseSelector: MemoizedSelector<
    object,
    HttpResponse,
    (s1: ISharedState) => HttpResponse
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
      }),
    );
    effect(() => {
      const response = this.sharedStore.getResponse();
      if (response.isPendingCount > 0) {
        this.spinnerService.loadingOn();
      } else {
        this.spinnerService.loadingOff();
      }
    });
  }

  getResponseDetailsSelector(action: Action) {
    return createSelector(selectSharedState, (state) =>
      getResponseDetails(state, action.type),
    );
  }

  getResponseDetails(action: Action): Observable<ResponseDetails> {
    return this.store.pipe(select(this.getResponseDetailsSelector(action)));
  }

  getResponseDetailsSignal(event: EventInstance<string, any>) {
    return this.sharedStore.getResponseDetails$(event, {
      injector: this.injector,
    });
  }

  dispatchAction(action: Action) {
    this.store.dispatch(action);
  }

  dispatchActionFromSignal(
    action: Parameters<Store['dispatch']>[0],
    config?: {
      injector: Injector;
    },
  ) {
    this.store.dispatch(action, config);
  }

  dispatchEvent(event: EventInstance<string, any>) {
    this.dispatcher.dispatch(event);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
