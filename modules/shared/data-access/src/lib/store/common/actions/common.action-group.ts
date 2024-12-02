import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const loginActionGroup = createActionGroup({
  source: 'Login',
  events: {
    updateAccessToken: props<{ accessToken: string | undefined }>(),
    updateAccessTokenSuccess: emptyProps(),
    signOut: emptyProps(),
    refreshAccessToken: emptyProps(),
  },
});
