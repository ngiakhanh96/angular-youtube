import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-video-title',
  templateUrl: './video-title.component.html',
  styleUrls: ['./video-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--font-weight]': 'fontWeight()',
  },
})
export class VideoTitleComponent {
  title = input.required<string>();
  fontWeight = input<string>('500');
}
