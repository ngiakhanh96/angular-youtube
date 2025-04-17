import {
  BaseEffects,
  IInvidiousVideoInfo,
  InvidiousHttpService,
} from '@angular-youtube/shared-data-access';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { searchPageActionGroup } from '../actions/search-page.action-group';

export class SearchPageEffects extends BaseEffects {
  private invidiousService = inject(InvidiousHttpService);

  searchYoutubeVideosInfo$ = this.createHttpEffectAndUpdateResponse(
    searchPageActionGroup.searchYoutubeVideos,
    (action) => {
      return this.invidiousService.searchVideosInfo(action.searchTerm).pipe(
        switchMap((videosInfo) =>
          combineLatest([
            ...videosInfo.map((p) =>
              this.invidiousService.getVideoInfo(p.videoId).pipe(
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
          return searchPageActionGroup.searchYoutubeVideosSuccess({
            searchedVideosInfo: searchedVideosInfo,
          });
        }),
      );
    },
  );
}
