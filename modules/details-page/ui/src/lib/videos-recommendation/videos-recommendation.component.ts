import {
  IVideoCategoryViewModel,
  VideoCategoriesComponent,
} from '@angular-youtube/home-page-ui';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'ay-videos-recommendation',
  templateUrl: './videos-recommendation.component.html',
  styleUrls: ['./videos-recommendation.component.scss'],
  imports: [VideoCategoriesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosRecommendationInfoComponent {
  //TODO Need to find an api to get this
  videosCategoriesViewModel = signal<IVideoCategoryViewModel[]>([
    {
      id: 'all',
      title: 'All',
    },
    {
      id: 'films',
      title: 'Films',
    },
    {
      id: 'animation',
      title: 'Animation',
    },
    {
      id: 'music',
      title: 'Music',
    },
    {
      id: 'lofi',
      title: 'Lofi',
    },
    {
      id: 'sports',
      title: 'Sports',
    },
    {
      id: 'LOL',
      title: 'LOL',
    },
    {
      id: 'travel',
      title: 'Travel',
    },
    {
      id: 'events',
      title: 'Events',
    },
    {
      id: 'gaming',
      title: 'Gaming',
    },
    {
      id: 'people',
      title: 'People',
    },
    {
      id: 'shopping',
      title: 'Shopping',
    },
  ]);
}
