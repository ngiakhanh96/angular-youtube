import { createFeature, createReducer } from '@ngrx/store';
import { initialBaseState } from '../../base/reducers/base.reducer';

export const loginStateName = 'login';
export interface ILoginState {
  test: string;
}
export const initialLoginState: ILoginState = {
  ...initialBaseState,
  test: '',
};

const reducer = createReducer(initialLoginState);

export const { reducer: loginReducer, selectLoginState } = createFeature<
  string,
  ILoginState
>({
  name: loginStateName,
  reducer: reducer,
});
