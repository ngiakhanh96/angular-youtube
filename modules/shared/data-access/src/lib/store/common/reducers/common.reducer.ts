import { createFeature, createReducer, on } from '@ngrx/store';
import { initialBaseState } from '../../base/reducers/base.reducer';
import { loginActionGroup } from '../actions/common.action-group';

export const loginStateName = 'login';
export interface ILoginState {
  test: string;
}
export const initialLoginState: ILoginState = {
  ...initialBaseState,
  test: '',
};

const reducer = createReducer(
  initialLoginState,
  on(loginActionGroup.updateAccessTokenSuccess, (state) => state)
);

export const { reducer: loginReducer, selectLoginState } = createFeature<
  string,
  ILoginState
>({
  name: loginStateName,
  reducer: reducer,
});
