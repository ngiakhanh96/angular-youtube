import { DestroyRef, effect, inject, Injector, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EventInstance } from '@ngrx/signals/events';
import { first } from 'rxjs';
import { HttpResponseStatus } from '../models/http-response/http-response.model';
import { SandboxService } from '../services/sandbox.service';

export abstract class BaseWithSandBoxComponent {
  protected activatedRoute = inject(ActivatedRoute);
  protected injector = inject(Injector);
  protected destroyRef = inject(DestroyRef);
  protected sandbox = inject(SandboxService);

  protected takeUntilDestroyed<T>() {
    return takeUntilDestroyed<T>(this.destroyRef);
  }

  protected get queryParamsSignal() {
    return toSignal(this.activatedRoute.queryParams, {
      injector: this.injector,
    });
  }

  protected dispatchEvent(
    event: EventInstance<string, any>,
    successfulCallBack?: () => void,
  ) {
    this.sandbox.dispatchEvent(event);
    setTimeout(() => {
      const responseDetails = this.sandbox.getResponseDetailsSignal(event);
      responseDetails
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

  protected dispatchEventFromSignal(
    eventSignal: Signal<EventInstance<string, any>>,
    successfulCallBack?: () => void,
    config?: {
      injector: Injector;
    },
  ) {
    effect(
      () => {
        const event: EventInstance<string, any> = eventSignal();
        this.sandbox.dispatchEvent(event);
        setTimeout(() => {
          const responseDetails = this.sandbox.getResponseDetailsSignal(event);
          responseDetails
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
      },
      {
        injector: config?.injector ?? this.injector,
      },
    );
  }
}
