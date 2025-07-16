import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
export const searchPageEventGroup = eventGroup({
  source: 'SearchPage',
  events: {
    searchYoutubeVideos: type<{
      searchTerm: string;
      page: number;
    }>(),
    searchYoutubeVideosSuccess: type<{
      searchTerm: string;
      searchedVideosInfo: IInvidiousVideoInfo[];
      page: number;
    }>(),
  },
});
