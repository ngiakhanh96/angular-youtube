import { SocialUser } from '@abacritt/angularx-social-login';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const loginActionGroup = createActionGroup({
  source: 'Login',
  events: {
    updateAccessToken: props<{ user: SocialUser | undefined }>(),
    updateAccessTokenSuccess: emptyProps(),
    signOut: emptyProps(),
    refreshAccessToken: emptyProps(),
  },
});
