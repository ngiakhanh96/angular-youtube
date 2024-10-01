import { ThumbnailComponent } from '@angular-youtube/home-page-ui';
import { YoutubeService } from '@angular-youtube/shared-data-access';
import { Component, inject, signal } from '@angular/core';

export interface IThumbnailDetails {
  videoId: string;
  title: string;
  channelName: string;
  viewCount: number;
  publishedDate: Date;
}

@Component({
  selector: 'ay-browse',
  standalone: true,
  imports: [ThumbnailComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent {
  private youtubeService = inject(YoutubeService);
  protected date = new Date(2024, 8, 17);
  protected videoList = signal<IThumbnailDetails[]>([
    {
      videoId: 'GGqPl7SRLYc',
      title:
        'NÊN CHỜ HAY NÊN QUÊN - CHU THÚY QUỲNH Gây Nghiện Với Giọng Live Đậm Chất Riêng | Mây Lang Thang asdasdasdasdasda',
      channelName: 'Diệu Nhiên Lofi',
      viewCount: 12333333333333,
      publishedDate: this.date,
    },
    {
      videoId: '_XCtJYgs5Ms',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      channelName: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: 'ddxY9C7pZSE',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      channelName: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: '9-LuToOq8Lc',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      channelName: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: 'QaJbAennB_Q',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      channelName: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: 'rOBF7omfM4U',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      channelName: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
  ]);

  constructor() {
    this.youtubeService.getOverviewVideos().subscribe();
    this.youtubeService.getChannelInfo().subscribe();
  }
}
