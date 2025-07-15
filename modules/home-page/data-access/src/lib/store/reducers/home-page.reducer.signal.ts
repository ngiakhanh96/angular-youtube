import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { homePageEventGroup } from '../actions/home-page.event-group';
import { withHomeEffects } from '../effects/home-page.effect.signal';
import { IHomePageState, initialHomePageState } from './home-page.reducer';

export const HomePageStore = signalStore(
  withState<IHomePageState>(initialHomePageState),
  withHomeEffects(),
  withHomeReducer(),
);

export function withHomeReducer() {
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
