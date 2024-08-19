import { createReducer, on } from '@ngrx/store';
import {
  signIn,
  signInError,
  signInSuccess,
  signOut,
  signOutError,
  signOutSuccess,
} from './user.action';
import { SocialUser } from '@abacritt/angularx-social-login';
import { GenericState } from '@angular-youtube/shared-data-access';

export type UserState = GenericState<SocialUser, UserStatus>;

export enum UserStatus {
  Pending = 'pending',
  SignInSuccess = 'signInSuccess',
  SignInError = 'signInError',
  Loading = 'loading',
  SignOutSuccess = 'signOutSuccess',
  SignOutError = 'signOutError',
}

const initialUserState: UserState = {
  data: null,
  status: UserStatus.Pending,
  error: null,
};

export const featuredUserStateKey = 'user';

export const featuredUserStateReducer = createReducer(
  initialUserState,
  on(signIn, (state) => ({
    ...state,
    status: UserStatus.Loading,
  })),
  on(signInSuccess, (state, { user }) => ({
    ...state,
    data: user,
    status: UserStatus.SignInSuccess,
    error: null,
  })),
  on(signInError, (state, { error }) => ({
    ...state,
    status: UserStatus.SignInError,
    error,
  })),
  on(signOut, (state) => ({
    ...state,
    status: UserStatus.Loading,
  })),
  on(signOutSuccess, (state) => ({
    data: null,
    status: UserStatus.SignOutSuccess,
    error: null,
  })),
  on(signOutError, (state, { error }) => ({
    ...state,
    status: UserStatus.SignOutError,
    error,
  }))
);
