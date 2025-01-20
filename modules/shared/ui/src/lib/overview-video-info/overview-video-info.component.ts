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
  host: {
    '[style.--title-font-size]': 'titleFontSize()',
    '[style.--title-margin-bottom]': 'titleMarginBottom()',
  },
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
  titleFontSize = input('16px');
  titleMarginBottom = input('4px');
  publishedDateString = computed(() =>
    Utilities.publishedDateToString(this.publishedDate()),
  );
}
