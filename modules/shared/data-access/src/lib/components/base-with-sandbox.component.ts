import { inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Action, MemoizedSelector, select } from '@ngrx/store';
import { first } from 'rxjs';
import { HttpResponseStatus } from '../models/http-response/http-response.model';
import { SandboxService } from '../services/base.sandbox.service';

export abstract class BaseWithSandBoxComponent {
  private sandbox = inject(SandboxService);
  protected untilDestroyed = takeUntilDestroyed();
  protected selectSignal<T>(selector: MemoizedSelector<object, T>) {
    return toSignal(this.sandbox.store.pipe(select(selector)));
  }
  protected dispatchAction(action: Action, successfulCallBack?: () => void) {
    setTimeout(() => {
      this.sandbox.dispatch(action);
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
}
