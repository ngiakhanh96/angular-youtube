import { IInvidiousSearchSuggestions } from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { headerActionGroup } from '../actions/header.action-group';

export const headerStateName = 'header';

export interface IHeaderState {
  searchSuggestions: IInvidiousSearchSuggestions | undefined;
}
export const initialHeaderState: IHeaderState = {
  searchSuggestions: undefined,
};

const reducer = createReducer(
  initialHeaderState,
  on(
    headerActionGroup.loadYoutubeSearchSuggestionsSuccess,
    (state, { searchSuggestions }) => ({
      ...state,
      searchSuggestions: searchSuggestions,
    }),
  ),
);

export const {
  reducer: headerReducer,
  selectHeaderState,
  selectSearchSuggestions: selectHeaderSearchSuggestions,
} = createFeature<string, IHeaderState>({
  name: headerStateName,
  reducer: reducer,
});
