import { IInvidiousSearchSuggestions } from '@angular-youtube/shared-data-access';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
export const headerEventGroup = eventGroup({
  source: 'Header',
  events: {
    loadYoutubeSearchSuggestions: type<{ searchQuery: string }>(),
    loadYoutubeSearchSuggestionsSuccess: type<{
      searchSuggestions: IInvidiousSearchSuggestions;
    }>(),
  },
});
