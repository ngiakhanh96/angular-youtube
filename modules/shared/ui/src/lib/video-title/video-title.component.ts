import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-formatted-string',
  templateUrl: './video-title.component.html',
  styleUrls: ['./video-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--font-weight]': 'fontWeight()',
    '[style.--line-clamp]': 'lineClamp()',
  },
})
export class FormattedStringComponent {
  title = input.required<string>();
  fontWeight = input<string>('500');
  lineClamp = input<string>('2');
}
