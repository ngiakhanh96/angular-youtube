import {
  IChannelItem,
  IFormatStream,
  IPopularYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { createActionGroup, props } from '@ngrx/store';
export const homePageActionGroup = createActionGroup({
  source: 'HomePage',
  events: {
    loadYoutubePopularVideos: props<{
      nextPage: boolean;
      itemPerPage: number;
      videoCategory?: number;
    }>(),
    loadYoutubePopularVideosSuccess: props<{
      nextPage: boolean;
      videos: IPopularYoutubeVideos;
      channelsInfo: Record<string, IChannelItem>;
      videosInfo: Record<string, IFormatStream>;
    }>(),
  },
});
