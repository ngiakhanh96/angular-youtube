import { inject, Injector } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Action, MemoizedSelector, select } from '@ngrx/store';
import { CreatorsNotAllowedCheck } from '@ngrx/store/src/models';
import { first } from 'rxjs';
import { HttpResponseStatus } from '../models/http-response/http-response.model';
import { SandboxService } from '../services/base.sandbox.service';

export abstract class BaseWithSandBoxComponent {
  private sandbox = inject(SandboxService);
  protected activatedRoute = inject(ActivatedRoute);
  protected untilDestroyed = takeUntilDestroyed();
  protected get queryParamsSignal() {
    return toSignal(this.activatedRoute.queryParams);
  }
  protected selectSignal<T>(selector: MemoizedSelector<object, T>) {
    return toSignal(this.sandbox.store.pipe(select(selector)));
  }
  protected dispatchAction(action: Action, successfulCallBack?: () => void) {
    setTimeout(() => {
      this.sandbox.dispatchAction(action);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      successfulCallBack ??= () => {};
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
              successfulCallBack!();
            }
          });
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
    setTimeout(() => {
      this.sandbox.dispatchActionFromSignal(action, config);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      successfulCallBack ??= () => {};
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
              successfulCallBack!();
            }
          });
      });
    });
  }
}
