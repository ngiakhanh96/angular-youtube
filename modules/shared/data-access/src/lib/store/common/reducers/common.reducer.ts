import { createFeature, on } from '@ngrx/store';
import { BaseState } from '../../../models/state.model';
import { createAyReducer } from '../../base/reducers/base.reducer';
import { commonActionGroup } from '../actions/common.action-group';

export const commonStateName = 'common';
export interface ICommonState extends BaseState {
  test: string;
}
export const initialCommonState: ICommonState = {
  httpResponse: {
    isPendingCount: 0,
    details: {},
  },
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
} = createFeature({
  name: commonStateName,
  reducer: reducer,
});
