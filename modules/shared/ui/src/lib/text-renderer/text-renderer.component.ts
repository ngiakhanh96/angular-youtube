import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'ay-text-renderer',
  templateUrl: './text-renderer.component.html',
  styleUrls: ['./text-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--font-weight]': 'fontWeight()',
    '[style.--line-clamp]': 'lineClamp()',
    '[style.--line-height]': 'lineHeight()',
  },
})
export class TextRenderComponent {
  title = input.required<string>();
  fontWeight = input<string>('500');
  lineClamp = input<string>('2');
  overview = input(true);
  lineHeight = input<string>('22px');
  textLineClass = computed(() => {
    return this.lineClamp() === '1' ? 'one-line' : 'multi-line';
  });
}
