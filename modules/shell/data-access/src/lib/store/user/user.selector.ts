import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featuredUserStateKey, UserState } from './user.reducer';

export const getUserState = createFeatureSelector<UserState>(
  featuredUserStateKey
);

export const getUser = createSelector(getUserState, ({ data }) => {
  return data;
});
