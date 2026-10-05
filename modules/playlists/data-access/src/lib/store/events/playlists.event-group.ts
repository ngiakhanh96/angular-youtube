import { IMyPlaylistsResponse } from '@angular-youtube/shared-data-access';
import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const playlistsEventGroup = eventGroup({
  source: 'Playlists',
  events: {
    reset: type<void>(),
    load: type<{ pageToken?: string }>(),
    loadSuccess: type<{ response: IMyPlaylistsResponse; pageToken?: string }>(),
    open: type<{ playlistId: string }>(),
    openSuccess: type<void>(),
  },
});
