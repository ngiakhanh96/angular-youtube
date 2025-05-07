import { IInvidiousSearchSuggestions } from '@angular-youtube/shared-data-access';
import { createActionGroup, props } from '@ngrx/store';
export const headerActionGroup = createActionGroup({
  source: 'Header',
  events: {
    loadYoutubeSearchSuggestions: props<{ searchQuery: string }>(),
    loadYoutubeSearchSuggestionsSuccess: props<{
      searchSuggestions: IInvidiousSearchSuggestions;
    }>(),
  },
});
