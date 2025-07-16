import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { IChannelItem } from 'modules/shared/data-access/src/lib/models/http-response/channels-info.model';
import { IFormatStream } from 'modules/shared/data-access/src/lib/models/http-response/invidious-video-info.model';
import { IPopularYoutubeVideos } from 'modules/shared/data-access/src/lib/models/http-response/popular-youtube-videos.model';
import { withHomePageEffects } from '../effects/home-page.effect';
import { homePageEventGroup } from '../events/home-page.event-group';

export interface IHomePageState {
  videos: IPopularYoutubeVideos | undefined;
  channelsInfo: Record<string, IChannelItem>;
  videosInfo: Record<string, IFormatStream>;
}
export const initialHomePageState: IHomePageState = {
  videos: undefined,
  channelsInfo: {},
  videosInfo: {},
};

export const HomePageStore = signalStore(
  withState<IHomePageState>(initialHomePageState),
  withHomePageEffects(),
  withHomePageReducer(),
);

export function withHomePageReducer() {
  return signalStoreFeature(
    { state: type<IHomePageState>() },
    withReducer(
      on(
        homePageEventGroup.loadYoutubePopularVideosSuccess,
        (
          { payload: { nextPage, videos, channelsInfo, videosInfo } },
          state,
        ) => ({
          videos: {
            ...videos,
            items: nextPage
              ? [...(state.videos?.items ?? []), ...videos.items]
              : videos.items,
          },
          channelsInfo: {
            ...state.channelsInfo,
            ...channelsInfo,
          },
          videosInfo: {
            ...state.videosInfo,
            ...videosInfo,
          },
        }),
      ),
    ),
  );
}
