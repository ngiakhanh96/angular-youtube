import {
  IChannelItem,
  IFormatStream,
  IMyChannelInfo,
  IPopularYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
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
    loadMyChannelInfo: emptyProps(),
    loadMyChannelInfoSuccess: props<{ myChannelInfo: IMyChannelInfo }>(),
  },
});
