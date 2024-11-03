import {
  createAyActionGroup,
  IChannelItem,
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
    }>(),
    loadYoutubeVideoCategories: emptyProps(),
    loadYoutubeVideoCategoriesSuccess: props<{
      videoCategories: IVideoCategories;
    }>(),
  },
});
