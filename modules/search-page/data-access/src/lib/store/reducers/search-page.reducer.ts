import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { searchPageActionGroup } from '../actions/search-page.action-group';

export const searchPageStateName = 'searchPage';

export interface ISearchPageState {
  searchedVideosInfo: IInvidiousVideoInfo[];
  page: number;
}
export const initialSearchPageState: ISearchPageState = {
  searchedVideosInfo: [],
  page: 1,
};

const reducer = createReducer(
  initialSearchPageState,
  on(
    searchPageActionGroup.searchYoutubeVideosSuccess,
    (state, { searchedVideosInfo, page }) => ({
      ...state,
      searchedVideosInfo: [...state.searchedVideosInfo, ...searchedVideosInfo],
      page: page,
    }),
  ),
);

export const {
  reducer: searchPageReducer,
  selectSearchedVideosInfo: selectSearchedVideosInfo,
} = createFeature<string, ISearchPageState>({
  name: searchPageStateName,
  reducer: reducer,
});
