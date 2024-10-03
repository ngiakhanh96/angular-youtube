import {
  createAyActionGroup,
  IYoutubeVideos,
} from '@angular-youtube/shared-data-access';
import { props } from '@ngrx/store';

export const homePageActionGroup = createAyActionGroup({
  source: 'HomePage',
  events: {
    loadYoutubePopularVideos: props<{ nextPage: boolean }>(),
    loadYoutubePopularVideosSuccess: props<{
      nextPage: boolean;
      videos: IYoutubeVideos;
    }>(),
  },
});
