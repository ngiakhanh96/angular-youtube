import { createFeature, on } from '@ngrx/store';
import { BaseState } from '../../../models/state.model';
import {
  createAyReducer,
  initialBaseState,
} from '../../base/reducers/base.reducer';
import { commonActionGroup } from '../actions/common.action-group';

export const commonStateName = 'common';
export interface ICommonState extends BaseState {
  test: string;
}
export const initialCommonState: ICommonState = {
  ...initialBaseState,
  test: '',
};

const reducer = createAyReducer(
  commonActionGroup,
  initialCommonState,
  on(commonActionGroup.updateAccessTokenSuccess, (state) => state)
);

export const {
  reducer: commonReducer,
  selectCommonState,
  selectHttpResponse: selectCommonHttpResponse,
} = createFeature<string, ICommonState>({
  name: commonStateName,
  reducer: reducer,
});
