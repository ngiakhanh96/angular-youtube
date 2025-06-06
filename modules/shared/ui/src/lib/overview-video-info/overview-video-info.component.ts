import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ChannelNameComponent } from '../channel-name/channel-name.component';
import { ImageDirective } from '../directives/image/image.directive';
import { SkeletonDirective } from '../directives/skeleton/skeleton.directive';
import { TextRenderComponent } from '../text-renderer/text-renderer.component';
import { Utilities } from '../utilities/utilities';

@Component({
  selector: 'ay-overview-video-info',
  imports: [
    TextRenderComponent,
    ChannelNameComponent,
    ImageDirective,
    SkeletonDirective,
  ],
  templateUrl: './overview-video-info.component.html',
  styleUrls: ['./overview-video-info.component.scss'],
  host: {
    '[style.--title-font-size]': 'titleFontSize()',
    '[style.--channel-name-font-size]': 'channelNameFontSize()',
    '[style.--video-statistic-font-size]': 'videoStatisticFontSize()',
    '[style.--title-margin-bottom]': 'titleMarginBottom()',
    '[style.--channel-margin-top]': 'channelMarginTop()',
    '[style.--channel-info-height]': 'channelInfoHeight()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewVideoInfoComponent {
  isSkeleton = input(false);
  title = input<string>('');
  channelName = input<string>('');
  showChannelNameFirst = input<boolean>(false);
  channelLogoUrl = input<string | undefined>(undefined);
  viewCount = input<number>(0);
  channelMarginTop = input('0px');
  viewCountString = computed(() =>
    Utilities.numberToString(this.viewCount(), 'view', 'No'),
  );
  publishedDate = input.required<Date>();
  isVerified = input(false);
  titleFontWeight = input('500');
  titleFontSize = input('16px');
  titleLineHeight = input('22px');
  channelNameFontSize = input('14px');
  videoStatisticFontSize = input('14px');
  titleMarginBottom = input('4px');
  publishedDateString = computed(() =>
    Utilities.publishedDateToString(this.publishedDate()),
  );
  channelInfoHeight = input('24px');
}
