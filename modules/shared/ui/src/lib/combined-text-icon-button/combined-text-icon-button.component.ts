import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';

export interface CombinedTextIcon {
  displayText: string;
  svgIcon: string;
  transform?: string;
}

@Component({
  selector: 'ay-combined-text-icon-button',
  templateUrl: './combined-text-icon-button.component.html',
  styleUrls: ['./combined-text-icon-button.component.scss'],
  imports: [TextIconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CombinedTextIconButtonComponent {
  combinedTextIcons = input.required<CombinedTextIcon[]>();
  color = input<string>('black');
  svgIconMarginRight = input<string>('6px');
  backgroundColor = input<string>('rgba(0, 0, 0, 0.05)');
  hoverBackgroundColor = input<string>('rgba(0, 0, 0, 0.1)');
  border = input<string>('none');

  firstTextIcon = computed(() => {
    if (!this.combinedTextIcons() || this.combinedTextIcons().length === 0) {
      return undefined;
    }
    return this.combinedTextIcons()[0];
  });
  lastTextIcon = computed(() => {
    if (!this.combinedTextIcons() || this.combinedTextIcons().length <= 1) {
      return undefined;
    }
    return this.combinedTextIcons()[this.combinedTextIcons().length - 1];
  });
  middleTextIcons = computed(() => {
    if (!this.combinedTextIcons() || this.combinedTextIcons().length <= 2) {
      return [];
    }
    return this.combinedTextIcons().slice(
      1,
      this.combinedTextIcons().length - 1,
    );
  });
}
