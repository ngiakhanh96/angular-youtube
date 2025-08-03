import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { searchPageEventGroup } from '../actions/search-page.event-group';
import { withSearchPageEffects } from '../effects/search-page.effect';

export interface ISearchPageState {
  searchTerm: string;
  searchedVideosInfo: IInvidiousVideoInfo[];
  page: number;
}
export const initialSearchPageState: ISearchPageState = {
  searchTerm: '',
  searchedVideosInfo: [],
  page: 1,
};

export const SearchPageStore = signalStore(
  withState<ISearchPageState>(initialSearchPageState),
  withSearchPageEffects(),
  withSearchPageReducer(),
);

export function withSearchPageReducer<_>() {
  return signalStoreFeature(
    { state: type<ISearchPageState>() },
    withReducer(
      on(
        searchPageEventGroup.searchYoutubeVideosSuccess,
        ({ payload: { searchTerm, searchedVideosInfo, page } }, state) => ({
          searchedVideosInfo:
            page === 1
              ? searchedVideosInfo
              : [...state.searchedVideosInfo, ...searchedVideosInfo],
          page: page,
          searchTerm,
        }),
      ),
    ),
  );
}
