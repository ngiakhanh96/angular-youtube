import { BaseWithSandBoxComponent } from '@angular-youtube/shared-data-access';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ay-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailsComponent extends BaseWithSandBoxComponent {}
