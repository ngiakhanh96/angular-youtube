import { HttpErrorResponse } from '@angular/common/http';
import {
  DestroyRef,
  effect,
  inject,
  Injector,
  Signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EventInstance } from '@ngrx/signals/events';
import { first, map, switchMap, timer } from 'rxjs';
import { HttpResponseStatus } from '../models/http-response/http-response.model';
import { SandboxService } from '../services/sandbox.service';

export abstract class BaseWithSandBoxComponent {
  protected activatedRoute = inject(ActivatedRoute);
  protected injector = inject(Injector);
  protected destroyRef = inject(DestroyRef);
  protected sandbox = inject(SandboxService);
  private readonly response$ = this.sandbox.sharedStore.getResponse$({
    injector: this.injector,
  });

  protected takeUntilDestroyed<T>() {
    return takeUntilDestroyed<T>(this.destroyRef);
  }

  protected readonly queryParamsSignal = toSignal(
    this.activatedRoute.queryParams,
    { requireSync: true },
  );

  protected dispatchEvent<TEvent extends EventInstance<string, unknown>>(
    event: TEvent,
    successfulCallBack?: () => void,
    errorCallback?: (error: HttpErrorResponse) => void,
  ) {
    this.sandbox.dispatchEvent(event);
    if (!successfulCallBack && !errorCallback) return;

    // Defer observing until the request handlers have recorded pending state.
    return timer(0)
      .pipe(
        switchMap(() => this.response$),
        map((response) => response.details[event.type]),
        first((details) => {
          // HTTP callers with an error callback need a confirmed response.
          if (!details) return !errorCallback;
          return details.status !== HttpResponseStatus.Pending;
        }),
        this.takeUntilDestroyed(),
      )
      .subscribe((details) => {
        if (!details || details.status === HttpResponseStatus.Success) {
          successfulCallBack?.();
        } else if (details.status === HttpResponseStatus.Error) {
          errorCallback?.(details.errorResponse.errorInfo);
        }
      });
  }

  protected dispatchEventFromSignal<
    TEvent extends EventInstance<string, unknown>,
  >(
    eventSignal: Signal<TEvent>,
    successfulCallBack?: () => void,
    config?: {
      injector: Injector;
    },
  ) {
    effect(
      (onCleanup) => {
        const event = eventSignal();
        const subscription = untracked(() =>
          this.dispatchEvent(event, successfulCallBack),
        );
        onCleanup(() => subscription?.unsubscribe());
      },
      {
        injector: config?.injector ?? this.injector,
      },
    );
  }
}
