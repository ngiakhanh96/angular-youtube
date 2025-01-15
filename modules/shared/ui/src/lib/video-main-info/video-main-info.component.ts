import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-video-main-info',
  templateUrl: './video-main-info.component.html',
  styleUrls: ['./video-main-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--font-weight]': 'fontWeight()',
    '[style.--line-clamp]': 'lineClamp()',
  },
})
export class VideoMainInfoComponent {
  title = input.required<string>();
  fontWeight = input<string>('500');
  lineClamp = input<string>('2');
  overview = input(true);
}
