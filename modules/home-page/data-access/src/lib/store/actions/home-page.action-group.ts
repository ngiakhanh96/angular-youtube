import {
  createAyActionGroup,
  IChannelItem,
  IPopularYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { props } from '@ngrx/store';
export const homePageActionGroup = createAyActionGroup({
  source: 'HomePage',
  events: {
    loadYoutubePopularVideos: props<{
      nextPage: boolean;
      itemPerPage: number;
    }>(),
    loadYoutubePopularVideosSuccess: props<{
      nextPage: boolean;
      videos: IPopularYoutubeVideos;
      channelsInfo: Record<string, IChannelItem>;
    }>(),
  },
});
