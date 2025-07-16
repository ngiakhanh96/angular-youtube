import { IInvidiousSearchSuggestions } from '@angular-youtube/shared-data-access';
import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { withHeaderEffects } from '../effects/header.effect';
import { headerEventGroup } from '../events/header.event-group';

export interface IHeaderState {
  searchSuggestions: IInvidiousSearchSuggestions | undefined;
}
export const initialHeaderState: IHeaderState = {
  searchSuggestions: undefined,
};

export const HeaderStore = signalStore(
  withState<IHeaderState>(initialHeaderState),
  withHeaderEffects(),
  withHeaderReducer(),
);

export function withHeaderReducer() {
  return signalStoreFeature(
    { state: type<IHeaderState>() },
    withReducer(
      on(
        headerEventGroup.loadYoutubeSearchSuggestionsSuccess,
        ({ payload: { searchSuggestions } }, state) => ({
          searchSuggestions: searchSuggestions,
        }),
      ),
    ),
  );
}
