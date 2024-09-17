import { inject } from '@angular/core';
import { Action } from '@ngrx/store';
import { first } from 'rxjs';
import { SandboxService } from '../injection-tokens/sandbox-service.injection-token';
import { HttpResponseStatus } from '../models/http-response.model';

export abstract class BaseWithSandBoxComponent {
  protected sandbox = inject(SandboxService);
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
                !details || details.status !== HttpResponseStatus.Pending
            )
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
