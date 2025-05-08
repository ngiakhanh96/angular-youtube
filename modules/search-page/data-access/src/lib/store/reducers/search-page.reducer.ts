import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { searchPageActionGroup } from '../actions/search-page.action-group';

export const searchPageStateName = 'searchPage';

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

const reducer = createReducer(
  initialSearchPageState,
  on(
    searchPageActionGroup.searchYoutubeVideosSuccess,
    (state, { searchTerm, searchedVideosInfo, page }) => ({
      ...state,
      searchedVideosInfo:
        page === 1
          ? searchedVideosInfo
          : [...state.searchedVideosInfo, ...searchedVideosInfo],
      page: page,
      searchTerm,
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
