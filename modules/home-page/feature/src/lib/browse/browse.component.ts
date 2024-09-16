

import { YoutubeService } from '@angular-youtube/shared-data-access';
import { Component, inject, OnInit } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'ay-browse',
  standalone: true,
  imports: [YouTubePlayer],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  private youtubeService = inject(YoutubeService);

  ngOnInit(): void {
    this.youtubeService.getOverviewVideos().subscribe();
  }
}
