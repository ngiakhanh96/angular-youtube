import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ChannelNameComponent } from '../channel-name/channel-name.component';
import { TextRenderComponent } from '../text-renderer/text-renderer.component';
import { Utilities } from '../utilities/utilities';

@Component({
  selector: 'ay-overview-video-info',
  imports: [TextRenderComponent, ChannelNameComponent],
  templateUrl: './overview-video-info.component.html',
  styleUrls: ['./overview-video-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewVideoInfoComponent {
  title = input.required<string>();
  channelName = input.required<string>();
  viewCount = input.required<number>();
  viewCountString = computed(() =>
    Utilities.numberToString(this.viewCount(), 'view', 'No'),
  );
  publishedDate = input.required<Date>();
  isVerified = input(false);
  publishedDateString = computed(() =>
    Utilities.publishedDateToString(this.publishedDate()),
  );
}
