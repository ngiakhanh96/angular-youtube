import {
  createHttpEffectAndUpdateResponse,
  HttpResponseStatus,
  sharedEventGroup,
  YoutubeHttpService,
} from '@angular-youtube/shared-data-access';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { filter, from, map, switchMap, tap, throwError } from 'rxjs';
import { playlistsEventGroup } from '../events/playlists.event-group';
import { IPlaylistsState } from '../reducers/playlists.reducer';

export function withPlaylistsEffects<_>() {
  return signalStoreFeature(
    { state: type<IPlaylistsState>() },
    withEventHandlers(
      (
        _store,
        events = inject(Events),
        youtube = inject(YoutubeHttpService),
        router = inject(Router),
      ) => ({
        load$: createHttpEffectAndUpdateResponse(
          events,
          playlistsEventGroup.load,
          ({ payload }) =>
            youtube.getMyPlaylists(payload.pageToken).pipe(
              map((response) =>
                playlistsEventGroup.loadSuccess({
                  response,
                  pageToken: payload.pageToken,
                }),
              ),
            ),
          false,
        ),
        open$: createHttpEffectAndUpdateResponse(
          events,
          playlistsEventGroup.open,
          ({ payload }) =>
            youtube.getPlaylistItemsInfo(payload.playlistId, undefined, 1).pipe(
              switchMap((response) => {
                const videoId = response.items[0]?.contentDetails.videoId;
                if (!videoId) {
                  return throwError(
                    () => new Error('This playlist has no videos to play.'),
                  );
                }
                return from(
                  router.navigate(['/watch'], {
                    queryParams: { v: videoId, list: payload.playlistId },
                  }),
                ).pipe(
                  map((navigated) => {
                    if (!navigated) {
                      throw new Error(
                        'Unable to open this playlist. Please try again.',
                      );
                    }
                    return playlistsEventGroup.openSuccess();
                  }),
                );
              }),
            ),
          false,
        ),
        reset$: events.on(playlistsEventGroup.reset).pipe(
          switchMap(() => [
            sharedEventGroup.cancelRequest({
              requestEventCreator: playlistsEventGroup.load,
            }),
            sharedEventGroup.cancelRequest({
              requestEventCreator: playlistsEventGroup.open,
            }),
          ]),
        ),
        requestFailure$: events.on(sharedEventGroup.updateResponse).pipe(
          filter(
            ({ payload }) =>
              payload.status === HttpResponseStatus.Error &&
              (payload.requestEventCreator === playlistsEventGroup.load ||
                payload.requestEventCreator === playlistsEventGroup.open),
          ),
          tap(({ payload }) => console.error(payload.errorResponse?.errorInfo)),
          filter(
            ({ payload }) =>
              payload.requestEventCreator === playlistsEventGroup.load,
          ),
          map(() => playlistsEventGroup.reset()),
        ),
      }),
    ),
  );
}
