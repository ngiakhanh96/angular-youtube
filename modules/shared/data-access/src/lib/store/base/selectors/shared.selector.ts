import { computed } from '@angular/core';
import { toObservable, ToObservableOptions } from '@angular/core/rxjs-interop';
import {
  signalStoreFeature,
  type,
  withComputed,
  withProps,
} from '@ngrx/signals';
import { EventInstance } from '@ngrx/signals/events';
import { map } from 'rxjs';
import { HttpResponseStatus } from '../../../models/http-response/http-response.model';
import { ISharedState } from '../reducers/shared.reducer';

export function withSharedSelector<_>() {
  return signalStoreFeature(
    { state: type<ISharedState>() },
    withComputed((state) => ({
      getResponse: computed(() => state.httpResponse()),
    })),
    withProps(({ httpResponse }) => ({
      getIsPendingRequest: (eventType: string) =>
        computed(
          () =>
            httpResponse().details[eventType]?.status ===
            HttpResponseStatus.Pending,
        ),
      getResponse$: (options: ToObservableOptions) =>
        toObservable(httpResponse, options),
      getResponseDetails$: (
        event: EventInstance<string, any>,
        options: ToObservableOptions,
      ) =>
        toObservable(httpResponse, options).pipe(
          map((response) => response.details[event.type]),
        ),
    })),
  );
}
