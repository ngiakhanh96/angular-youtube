import { emptyProps, props } from '@ngrx/store';
import { createAyActionGroup } from '../../base/actions/base.action-group';

export const commonActionGroup = createAyActionGroup({
  source: 'Common',
  events: {
    updateAccessToken: props<{ accessToken: string }>(),
    updateAccessTokenSuccess: emptyProps(),
    signOut: emptyProps(),
    refreshAccessToken: emptyProps(),
  },
});
