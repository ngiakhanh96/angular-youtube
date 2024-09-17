import { YoutubeService } from '@angular-youtube/shared-data-access';
import { Component, inject, OnInit } from '@angular/core';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';

@Component({
  selector: 'ay-browse',
  standalone: true,
  imports: [ThumbnailComponent],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  private youtubeService = inject(YoutubeService);

  ngOnInit(): void {
    this.youtubeService.getOverviewVideos().subscribe();
  }
}
