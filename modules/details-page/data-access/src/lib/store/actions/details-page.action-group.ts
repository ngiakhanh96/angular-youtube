import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { createActionGroup, props } from '@ngrx/store';
export const detailsPageActionGroup = createActionGroup({
  source: 'HomePage',
  events: {
    loadYoutubeVideo: props<{
      videoId: string;
    }>(),
    loadYoutubeVideoSuccess: props<{
      videoInfo: IInvidiousVideoInfo;
      recommendedVideosInfo: IInvidiousVideoInfo[];
    }>(),
  },
});
