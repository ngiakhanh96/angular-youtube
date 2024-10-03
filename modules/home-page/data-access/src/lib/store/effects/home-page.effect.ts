import {
  BaseEffects,
  YoutubeService,
} from '@angular-youtube/shared-data-access';
import { inject } from '@angular/core';
import { select } from '@ngrx/store';
import { map } from 'rxjs';
import { homePageActionGroup } from '../actions/home-page.action-group';
import { selectHomePageState } from '../reducers/home-page.reducer';

export class HomePageEffects extends BaseEffects<typeof homePageActionGroup> {
  private youtubeService = inject(YoutubeService);
  loadYoutubePopularVideos$ = this.createHttpEffectWithStateAndUpdateResponse(
    this.actionsGroup.loadYoutubePopularVideos,
    (_) => this.store.pipe(select(selectHomePageState)),
    ([action, homePageState]) => {
      return this.youtubeService
        .getOverviewVideos(
          20,
          action.nextPage ? homePageState.nextPageToken : undefined
        )
        .pipe(
          map((result) => {
            return this.actionsGroup.loadYoutubePopularVideosSuccess({
              nextPage: action.nextPage,
              videos: result,
            });
          })
        );
    }
  );

  constructor() {
    super(homePageActionGroup);
  }
}
