import {
  createHttpEffectAndUpdateResponse,
  IInvidiousVideoInfo,
  InvidiousHttpService,
} from '@angular-youtube/shared-data-access';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEffects } from '@ngrx/signals/events';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { searchPageEventGroup } from '../actions/search-page.event-group';
import { ISearchPageState } from '../reducers/search-page.reducer';

export function withSearchPageEffects<_>() {
  return signalStoreFeature(
    { state: type<ISearchPageState>() },
    withEffects(
      (
        store,
        events = inject(Events),
        invidiousService = inject(InvidiousHttpService),
      ) => ({
        searchYoutubeVideosInfo$: createHttpEffectAndUpdateResponse(
          events,
          searchPageEventGroup.searchYoutubeVideos,
          (event) => {
            return invidiousService
              .searchVideosInfo(event.payload.searchTerm, event.payload.page)
              .pipe(
                switchMap((videosInfo) =>
                  combineLatest([
                    ...videosInfo.map((p) =>
                      invidiousService.getVideoInfo(p.videoId).pipe(
                        catchError((error: HttpErrorResponse) => {
                          console.error(error);
                          return of(<IInvidiousVideoInfo>(<unknown>{
                            videoId: p.videoId,
                            formatStreams: [],
                          }));
                        }),
                      ),
                    ),
                  ]),
                ),
                map((searchedVideosInfo) => {
                  return searchPageEventGroup.searchYoutubeVideosSuccess({
                    searchTerm: event.payload.searchTerm,
                    searchedVideosInfo: searchedVideosInfo.filter(
                      (p) => p != null,
                    ),
                    page: event.payload.page,
                  });
                }),
              );
          },
          false,
        ),
      }),
    ),
  );
}
