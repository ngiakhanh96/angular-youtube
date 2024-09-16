import { createAyReducer } from '../../base/reducers/base.reducer';
import { BaseState } from '../../models/state.model';
import { commonActionGroup } from '../actions/common.action-group';

export const commonStateName = 'common';
export const initialCommonState: BaseState = {
  httpResponse: {
    isPendingCount: 0,
    details: {},
  },
};

export const commonReducer = createAyReducer(
  commonActionGroup,
  initialCommonState
);
