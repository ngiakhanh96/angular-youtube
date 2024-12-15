import {
  createAyActionGroup,
  IChannelItem,
  IFormatStream,
  IMyChannelInfo,
  IPopularYoutubeVideos,
  IVideoCategories,
} from '@angular-youtube/shared-data-access';
import { emptyProps, props } from '@ngrx/store';
export const homePageActionGroup = createAyActionGroup({
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
    loadYoutubeVideoCategories: emptyProps(),
    loadYoutubeVideoCategoriesSuccess: props<{
      videoCategories: IVideoCategories;
    }>(),
    loadMyChannelInfo: emptyProps(),
    loadMyChannelInfoSuccess: props<{ myChannelInfo: IMyChannelInfo }>(),
  },
});
