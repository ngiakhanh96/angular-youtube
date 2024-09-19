import { ThumbnailComponent } from '@angular-youtube/home-page-ui';
import { YoutubeService } from '@angular-youtube/shared-data-access';
import { Component, inject, OnInit, signal } from '@angular/core';

export interface IThumbnailDetails {
  videoId: string;
  title: string;
  author: string;
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
export class BrowseComponent implements OnInit {
  private youtubeService = inject(YoutubeService);
  protected date = new Date(2024, 8, 17);
  protected videoList = signal([
    {
      videoId: 'GGqPl7SRLYc',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      author: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: '_XCtJYgs5Ms',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      author: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: 'ddxY9C7pZSE',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      author: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: '9-LuToOq8Lc',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      author: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: 'QaJbAennB_Q',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      author: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: 'rOBF7omfM4U',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      author: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: 'rOBF7omfM4U',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      author: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
    {
      videoId: 'rOBF7omfM4U',
      title:
        'City Hall scandal intensifies: New calls for Mayor Adams to resign',
      author: 'FOX 5 New York',
      viewCount: 5900,
      publishedDate: this.date,
    },
  ]);
  ngOnInit(): void {
    this.youtubeService.getOverviewVideos().subscribe();
  }
}
