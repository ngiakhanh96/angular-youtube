import { createFeature, on } from '@ngrx/store';
import { IAccessTokenInfo } from '../../../models/http-response/auth.model';
import { IBaseState } from '../../../models/state.model';
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
}

export const initialSharedState: ISharedState = {
  ...initialBaseState,
  accessTokenInfo: undefined,
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
);

export const {
  reducer: sharedReducer,
  selectSharedState,
  selectAccessTokenInfo,
  selectHttpResponse: selectSharedHttpResponse,
} = createFeature<string, ISharedState>({
  name: sharedStateName,
  reducer: reducer,
});
