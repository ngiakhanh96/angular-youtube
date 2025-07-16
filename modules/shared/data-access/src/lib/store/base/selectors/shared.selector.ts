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
import { ISharedState } from '../reducers/shared.reducer';

export function withSharedSelector() {
  return signalStoreFeature(
    { state: type<ISharedState>() },
    withComputed((state) => ({
      getResponse: computed(() => state.httpResponse()),
    })),
    withProps(({ httpResponse }) => ({
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
