import { computed } from '@angular/core';
import { signalStoreFeature, type, withComputed } from '@ngrx/signals';
import { IBaseState } from '../../../models/state';

export function withHttpResponse() {
  return signalStoreFeature(
    { state: type<IBaseState>() },
    withComputed((state) => ({
      getResponse: computed(() => state.httpResponse()),
      getResponseDetails: computed(() => {
        return (eventType: string) => state.httpResponse().details[eventType];
      }),
    })),
  );
}
