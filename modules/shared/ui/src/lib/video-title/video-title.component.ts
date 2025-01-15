import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-video-title',
  templateUrl: './video-title.component.html',
  styleUrls: ['./video-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--font-weight]': 'fontWeight()',
    '[style.--line-clamp]': 'lineClamp()',
  },
})
export class VideoTitleComponent {
  title = input.required<string>();
  fontWeight = input<string>('500');
  lineClamp = input<string>('2');
  overview = input(true);
}
