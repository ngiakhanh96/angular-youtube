import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from '../directives/icon/icon.directive';

@Component({
  selector: 'ay-text-icon-button',
  templateUrl: './text-icon-button.component.html',
  styleUrls: ['./text-icon-button.component.scss'],
  imports: [MatButtonModule, MatIconModule, IconDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--color]': 'color()',
    '[style.--space-between]': 'spaceBetween()',
    '[style.--background-color]': 'backgroundColor()',
    '[style.--hover-background-color]': 'hoverBackgroundColor()',
    '[style.--border]': 'border()',
    '[style.--border-radius]': 'borderRadius()',
    '[style.--border-left-radius]': 'borderLeftRadius()',
    '[style.--border-right-radius]': 'borderRightRadius()',
    '[style.--icon-padding-left]': 'iconPaddingLeft()',
    '[style.--icon-padding-right]': 'iconPaddingRight()',
    '[style.--font-weight]': 'fontWeight()',
    '[style.--font-size]': 'fontSize()',
  },
})
export class TextIconButtonComponent {
  displayText = input<string>();
  svgIcon = input<string>();
  color = input<string>('black');
  spaceBetween = input<string>('6px');
  backgroundColor = input<string>('rgba(0, 0, 0, 0.05)');
  hoverBackgroundColor = input<string>('rgba(0, 0, 0, 0.1)');
  border = input<string>('none');
  borderRadius = input<string>('24px');
  borderRadiusForLeft = input<boolean>(true);
  borderRadiusForRight = input<boolean>(true);
  iconPaddingLeft = input<string>('15px');
  iconPaddingRight = input<string>('15px');
  transform = input<string | undefined>(undefined);
  fontWeight = input<string>('500');
  fontSize = input<string>('14px');

  borderLeftRadius = computed(() => {
    const borderRadiusForLeft = this.borderRadiusForLeft();
    const borderRadius = this.borderRadius();
    if (borderRadiusForLeft) {
      return borderRadius;
    }
    return '0px';
  });

  borderRightRadius = computed(() => {
    const borderRadiusForRight = this.borderRadiusForRight();
    const borderRadius = this.borderRadius();
    if (borderRadiusForRight) {
      return borderRadius;
    }
    return '0px';
  });
}
