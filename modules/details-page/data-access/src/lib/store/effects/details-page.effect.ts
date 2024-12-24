import {
  BaseEffects,
  InvidiousHttpService,
} from '@angular-youtube/shared-data-access';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { detailsPageActionGroup } from '../actions/details-page.action-group';

export class DetailsPageEffects extends BaseEffects {
  private invidiousService = inject(InvidiousHttpService);

  loadYoutubeVideoInfo$ = this.createHttpEffectAndUpdateResponse(
    detailsPageActionGroup.loadYoutubeVideo,
    (action) => {
      return this.invidiousService.getVideoInfo(action.videoId).pipe(
        map((videoInfo) => {
          return detailsPageActionGroup.loadYoutubeVideoSuccess({
            videoInfo: videoInfo,
          });
        }),
      );
    },
  );
}
