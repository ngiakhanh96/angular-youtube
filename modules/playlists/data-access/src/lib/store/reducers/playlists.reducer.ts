import { IPlaylistItem } from '@angular-youtube/shared-data-access';
import {
  signalStore,
  signalStoreFeature,
  type,
  withState,
} from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { withPlaylistsEffects } from '../effects/playlists.effect';
import { playlistsEventGroup } from '../events/playlists.event-group';

export interface IPlaylistsState {
  playlists: IPlaylistItem[];
  nextPageToken: string | null;
}

const initialState: IPlaylistsState = {
  playlists: [],
  nextPageToken: null,
};

export const PlaylistsStore = signalStore(
  withState<IPlaylistsState>(initialState),
  withPlaylistsEffects(),
  withPlaylistsReducer(),
);

export function withPlaylistsReducer<_>() {
  return signalStoreFeature(
    { state: type<IPlaylistsState>() },
    withReducer(
      on(playlistsEventGroup.reset, () => initialState),
      on(playlistsEventGroup.loadSuccess, ({ payload }, state) => ({
        playlists: payload.pageToken
          ? [...state.playlists, ...payload.response.items]
          : payload.response.items,
        nextPageToken: payload.response.nextPageToken ?? null,
      })),
    ),
  );
}
