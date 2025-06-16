import { DestroyRef, inject, Injector, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Action, MemoizedSelector, select, Store } from '@ngrx/store';
import { first, map } from 'rxjs';
import { HttpResponseStatus } from '../models/http-response/http-response.model';
import { SandboxService } from '../services/sandbox.service';

export abstract class BaseWithSandBoxComponent {
  protected activatedRoute = inject(ActivatedRoute);
  protected injector = inject(Injector);
  protected destroyRef = inject(DestroyRef);
  private sandbox = inject(SandboxService);

  protected takeUntilDestroyed<T>() {
    return takeUntilDestroyed<T>(this.destroyRef);
  }

  protected get queryParamsSignal() {
    return toSignal(this.activatedRoute.queryParams, {
      injector: this.injector,
    });
  }

  protected select<T, K>(mapFn: (state: T) => K) {
    return this.sandbox.store.select(mapFn);
  }

  protected selectSignal<TInput, TReturn = TInput>(
    selector: MemoizedSelector<object, TInput>,
    mapFn?: (value: TInput) => TReturn,
  ) {
    return toSignal(
      this.sandbox.store.pipe(
        select(selector),
        map((value) => (mapFn ? mapFn(value) : value)),
      ),
      {
        injector: this.injector,
      },
    ) as Signal<TReturn>;
  }
  protected dispatchAction(action: Action, successfulCallBack?: () => void) {
    this.sandbox.dispatchAction(action);
    setTimeout(() => {
      this.sandbox
        .getResponseDetails(action)
        .pipe(
          first(
            (details) =>
              !details || details.status !== HttpResponseStatus.Pending,
          ),
        )
        .subscribe((details) => {
          if (!details || details.status === HttpResponseStatus.Success) {
            successfulCallBack?.();
          }
        });
    });
  }

  protected dispatchActionFromSignal(
    action: Parameters<Store['dispatch']>[0],
    successfulCallBack?: () => void,
    config?: {
      injector: Injector;
    },
  ) {
    this.sandbox.dispatchActionFromSignal(action, config);
    setTimeout(() => {
      this.sandbox
        .getResponseDetails(action())
        .pipe(
          first(
            (details) =>
              !details || details.status !== HttpResponseStatus.Pending,
          ),
        )
        .subscribe((details) => {
          if (!details || details.status === HttpResponseStatus.Success) {
            successfulCallBack?.();
          }
        });
    });
  }
}
