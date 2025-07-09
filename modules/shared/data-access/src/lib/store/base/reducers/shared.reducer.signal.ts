import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';

import { sharedEventGroup } from '../actions/shared.event-group';
import { withSharedEffects } from '../effects/shared.effect.signal';
import { withHttpResponse } from '../selectors/base.computed';
import { updateResponse } from './base.reducer';
import { initialSharedState, ISharedState } from './shared.reducer';

export const SharedStore = signalStore(
  withState<ISharedState>(initialSharedState),
  withSharedEffects(),
  withHttpResponse(),
  withSharedReducer(),
);

export function withSharedReducer() {
  return signalStoreFeature(
    { state: type<ISharedState>() },
    withReducer(
      on(
        sharedEventGroup.updateResponse,
        (
          {
            payload: {
              requestEventCreator,
              status,
              errorResponse,
              showSpinner,
            },
          },
          state,
        ) => ({
          httpResponse: updateResponse(
            requestEventCreator,
            state,
            status,
            showSpinner,
            errorResponse,
          ),
        }),
      ),
      on(sharedEventGroup.getAccessTokenInfoSuccess, (event) => ({
        accessTokenInfo: event.payload.accessTokenInfo,
      })),
      on(sharedEventGroup.loadYoutubeVideoCategoriesSuccess, (event) => ({
        videoCategories: event.payload.videoCategories,
      })),
      on(sharedEventGroup.loadMyChannelInfoSuccess, (event) => ({
        myChannelInfo: event.payload.myChannelInfo,
      })),
    ),
  );
}
