/* eslint-disable ngrx/prefer-inline-action-props */
import { UserError } from '@angular-youtube/shared/data-access';
import { createAction, props } from '@ngrx/store';
import { SocialUser } from 'angularx-social-login';

export const signIn = createAction('[Auth API] Login');
export const signInSuccess = createAction(
  '[Auth API] Login Success',
  props<{
    user: SocialUser;
  }>()
);
export const signInError = createAction(
  '[Auth API] Login Error',
  props<UserError>()
);
export const signOut = createAction('[Auth API] Logout');
export const signOutSuccess = createAction('[Auth API] Logout Success');
export const signOutError = createAction(
  '[Auth API] Logout Error',
  props<UserError>()
);
