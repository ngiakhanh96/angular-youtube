import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { createActionGroup, props } from '@ngrx/store';
export const searchPageActionGroup = createActionGroup({
  source: 'SearchPage',
  events: {
    searchYoutubeVideos: props<{
      searchTerm: string;
      page: number;
    }>(),
    searchYoutubeVideosSuccess: props<{
      searchedVideosInfo: IInvidiousVideoInfo[];
      page: number;
    }>(),
  },
});
