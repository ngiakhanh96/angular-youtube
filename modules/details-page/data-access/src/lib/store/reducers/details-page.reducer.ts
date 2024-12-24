import { IInvidiousVideoInfo } from '@angular-youtube/shared-data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { detailsPageActionGroup } from '../actions/details-page.action-group';

export const detailsPageStateName = 'detailsPage';

export interface IDetailsPageState {
  videoInfo: IInvidiousVideoInfo | undefined;
}
export const initialDetailsPageState: IDetailsPageState = {
  videoInfo: undefined,
};

const reducer = createReducer(
  initialDetailsPageState,
  on(
    detailsPageActionGroup.loadYoutubeVideoSuccess,
    (state, { videoInfo }) => ({
      ...state,
      videoInfo: videoInfo,
    }),
  ),
);

export const {
  reducer: detailsPageReducer,
  selectDetailsPageState,
  selectVideoInfo: selectDetailsPageVideoInfo,
} = createFeature<string, IDetailsPageState>({
  name: detailsPageStateName,
  reducer: reducer,
});
