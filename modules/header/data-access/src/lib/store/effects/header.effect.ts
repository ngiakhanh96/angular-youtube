import { createHttpEffectAndUpdateResponse } from '@angular-youtube/shared-data-access';
import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { InvidiousHttpService } from 'modules/shared/data-access/src/lib/services/http/invidious.http.service';
import { map } from 'rxjs';
import { headerEventGroup } from '../events/header.event-group';
import { IHeaderState } from '../reducers/header.reducer';

export function withHeaderEffects() {
  return signalStoreFeature(
    { state: type<IHeaderState>() },
    withEffects(
      (
        store,
        events = inject(Events),
        invidiousService = inject(InvidiousHttpService),
      ) => ({
        loadYoutubeVideoInfo$: createHttpEffectAndUpdateResponse(
          events,
          headerEventGroup.loadYoutubeSearchSuggestions,
          (event) => {
            return invidiousService
              .getSearchSuggestions(event.payload.searchQuery)
              .pipe(
                map((searchSuggestions) =>
                  headerEventGroup.loadYoutubeSearchSuggestionsSuccess({
                    searchSuggestions: searchSuggestions,
                  }),
                ),
              );
          },
          false,
        ),
      }),
    ),
  );
}
