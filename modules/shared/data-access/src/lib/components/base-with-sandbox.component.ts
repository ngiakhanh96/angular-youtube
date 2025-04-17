import { DestroyRef, inject, Injector, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Action, MemoizedSelector, select } from '@ngrx/store';
import { CreatorsNotAllowedCheck } from '@ngrx/store/src/models';
import { first, map } from 'rxjs';
import { HttpResponseStatus } from '../models/http-response/http-response.model';
import { SandboxService } from '../services/sandbox.service';

export abstract class BaseWithSandBoxComponent {
  private sandbox = inject(SandboxService);
  protected activatedRoute = inject(ActivatedRoute);
  protected injector = inject(Injector);
  protected destroyRef = inject(DestroyRef);

  protected takeUntilDestroyed<T>() {
    return takeUntilDestroyed<T>(this.destroyRef);
  }

  protected get queryParamsSignal() {
    return toSignal(this.activatedRoute.queryParams, {
      injector: this.injector,
    });
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
    action: () => Action & CreatorsNotAllowedCheck<() => Action>,
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
