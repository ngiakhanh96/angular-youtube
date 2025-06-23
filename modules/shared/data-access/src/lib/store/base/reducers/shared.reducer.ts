import { createFeature, on } from '@ngrx/store';
import { IAccessTokenInfo } from '../../../models/http-response/auth.model';
import { IMyChannelInfo } from '../../../models/http-response/my-channel-info.model';
import { IVideoCategories } from '../../../models/http-response/video-categories-model';
import { IBaseState } from '../../../models/state';
import { sharedActionGroup } from '../../base/actions/shared.action-group';
import {
  createAyReducer,
  initialBaseState,
} from '../../base/reducers/base.reducer';

export const sharedStateName = 'shared';

export interface IAccessTokenInfoState extends IAccessTokenInfo {
  expired_datetime: Date;
}

export interface ISharedState extends IBaseState {
  accessTokenInfo: IAccessTokenInfoState | undefined;
  videoCategories: IVideoCategories | undefined;
  myChannelInfo: IMyChannelInfo | undefined;
}

export const initialSharedState: ISharedState = {
  ...initialBaseState,
  accessTokenInfo: undefined,
  videoCategories: undefined,
  myChannelInfo: undefined,
};

const reducer = createAyReducer(
  sharedActionGroup,
  initialSharedState,
  on(
    sharedActionGroup.getAccessTokenInfoSuccess,
    (state, { accessTokenInfo }) => ({
      ...state,
      accessTokenInfo: accessTokenInfo,
    }),
  ),
  on(
    sharedActionGroup.loadYoutubeVideoCategoriesSuccess,
    (state, { videoCategories }) => ({
      ...state,
      videoCategories: videoCategories,
    }),
  ),
  on(
    sharedActionGroup.loadMyChannelInfoSuccess,
    (state, { myChannelInfo }) => ({
      ...state,
      myChannelInfo: myChannelInfo,
    }),
  ),
);

export const {
  reducer: sharedReducer,
  selectSharedState,
  selectAccessTokenInfo,
  selectVideoCategories,
  selectMyChannelInfo,
  selectHttpResponse: selectSharedHttpResponse,
} = createFeature<string, ISharedState>({
  name: sharedStateName,
  reducer: reducer,
});
