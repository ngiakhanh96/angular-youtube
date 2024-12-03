import { emptyProps, props } from '@ngrx/store';
import { createAyActionGroup } from '../../base/actions/base.action-group';
import { IAccessTokenInfoState } from '../reducers/shared.reducer';

export const sharedActionGroup = createAyActionGroup({
  source: 'Shared',
  events: {
    updateAccessToken: props<{ accessToken: string | undefined }>(),
    updateAccessTokenSuccess: props<{ accessToken: string }>(),
    getAccessTokenInfo: props<{ accessToken: string }>(),
    getAccessTokenInfoSuccess: props<{
      accessToken: string;
      accessTokenInfo: IAccessTokenInfoState;
    }>(),
    signOut: emptyProps(),
    refreshAccessToken: emptyProps(),
    empty: emptyProps(),
  },
});
