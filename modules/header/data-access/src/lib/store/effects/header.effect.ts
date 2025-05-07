import {
  BaseEffects,
  InvidiousHttpService,
} from '@angular-youtube/shared-data-access';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { headerActionGroup } from '../actions/header.action-group';

export class HeaderEffects extends BaseEffects {
  private invidiousService = inject(InvidiousHttpService);

  loadYoutubeVideoInfo$ = this.createHttpEffectAndUpdateResponse(
    headerActionGroup.loadYoutubeSearchSuggestions,
    (action) => {
      return this.invidiousService
        .getSearchSuggestions(action.searchQuery)
        .pipe(
          map((searchSuggestions) =>
            headerActionGroup.loadYoutubeSearchSuggestionsSuccess({
              searchSuggestions: searchSuggestions,
            }),
          ),
        );
    },
    false,
  );
}
