import {
  BaseEffects,
  IInvidiousVideoInfo,
  InvidiousHttpService,
} from '@angular-youtube/shared-data-access';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { detailsPageActionGroup } from '../actions/details-page.action-group';

export class DetailsPageEffects extends BaseEffects {
  private invidiousService = inject(InvidiousHttpService);

  loadYoutubeVideoInfo$ = this.createHttpEffectAndUpdateResponse(
    detailsPageActionGroup.loadYoutubeVideo,
    (action) => {
      return this.invidiousService.getVideoInfo(action.videoId).pipe(
        switchMap((videoInfo) =>
          combineLatest([
            ...videoInfo.recommendedVideos.map((p) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.invidiousService.getVideoInfo(p.videoId!).pipe(
                catchError((error: HttpErrorResponse) => {
                  console.error(error);
                  return of(<IInvidiousVideoInfo>(<unknown>{
                    videoId: p.videoId,
                    formatStreams: [],
                  }));
                }),
              ),
            ),
          ]).pipe(
            map((recommendedVideosInfo) => {
              return [videoInfo, ...recommendedVideosInfo] as const;
            }),
          ),
        ),
        map(([videoInfo, ...recommendedVideosInfo]) => {
          return detailsPageActionGroup.loadYoutubeVideoSuccess({
            videoInfo: videoInfo,
            recommendedVideosInfo: recommendedVideosInfo,
          });
        }),
      );
    },
  );
}
