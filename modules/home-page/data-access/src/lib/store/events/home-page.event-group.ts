import {
  IChannelItem,
  IFormatStream,
  IPopularYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const homePageEventGroup = eventGroup({
  source: 'HomePage',
  events: {
    loadYoutubePopularVideos: type<{
      nextPage: boolean;
      itemPerPage: number;
      videoCategory?: number;
    }>(),
    loadYoutubePopularVideosSuccess: type<{
      nextPage: boolean;
      videos: IPopularYoutubeVideos;
      channelsInfo: Record<string, IChannelItem>;
      videosInfo: Record<string, IFormatStream>;
    }>(),
  },
});
