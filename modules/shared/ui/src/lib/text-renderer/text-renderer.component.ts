import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-text-renderer',
  templateUrl: './text-renderer.component.html',
  styleUrls: ['./text-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--font-weight]': 'fontWeight()',
    '[style.--line-clamp]': 'lineClamp()',
  },
})
export class TextRenderComponent {
  title = input.required<string>();
  fontWeight = input<string>('500');
  lineClamp = input<string>('2');
  overview = input(true);
}
