import { createFeature } from '@ngrx/store';
import { IBaseState } from '../../../models/state.model';
import { sharedActionGroup } from '../../base/actions/shared.action-group';
import {
  createAyReducer,
  initialBaseState,
} from '../../base/reducers/base.reducer';

export const sharedStateName = 'shared';
export const initialCommonState: IBaseState = {
  ...initialBaseState,
};

const reducer = createAyReducer(sharedActionGroup, initialCommonState);

export const {
  reducer: sharedReducer,
  selectSharedState,
  selectHttpResponse: selectSharedHttpResponse,
} = createFeature<string, IBaseState>({
  name: sharedStateName,
  reducer: reducer,
});
