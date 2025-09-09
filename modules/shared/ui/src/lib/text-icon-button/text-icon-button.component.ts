import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from '../directives/icon/icon.directive';
import { RippleOnHoverDirective } from '../directives/ripple-on-hover/ripple-on-hover.directive';

@Component({
  selector: 'ay-text-icon-button',
  templateUrl: './text-icon-button.component.html',
  styleUrls: ['./text-icon-button.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    IconDirective,
    MatRippleModule,
    RippleOnHoverDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': 'widthHeight()',
    '[style.height]': 'widthHeight()',
    '[style.--color]': 'color()',
    '[style.--icon-margin-right]': 'svgIconMarginRight()',
    '[style.--icon-margin-left]': 'svgIconMarginLeft()',
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
    '[style.--disabled-color]': 'disabledColor()',
    '[style.--disabled-background-color]': 'disabledBackgroundColor()',
    '[style.--icon-width-height]': 'iconWidthHeight()',
  },
})
export class TextIconButtonComponent {
  widthHeight = input<string>('100%');
  displayText = input<string>();
  svgIcon = input<string>();
  color = input<string>('black');
  svgIconMarginRight = input<string>('6px');
  svgIconMarginLeft = input<string>('-6px');
  backgroundColor = input<string>('rgba(0, 0, 0, 0.05)');
  hoverBackgroundColor = input<string>('rgba(0, 0, 0, 0.1)');
  disabledColor = input<string>('rgba(0, 0, 0, 0.5)');
  disabledBackgroundColor = input<string>('rgba(0, 0, 0, 0.05)');
  border = input<string>('none');
  borderRadius = input<string>('24px');
  borderRadiusForLeft = input<boolean>(true);
  borderRadiusForRight = input<boolean>(true);
  iconPaddingLeft = input<string>('15px');
  iconPaddingRight = input<string>('15px');
  iconWidthHeight = input<string>('24px');
  transform = input<string | undefined>(undefined);
  fontWeight = input<string>('500');
  fontSize = input<string>('14px');
  disabled = input<boolean>(false);
  disabledRipple = input<boolean>(false);
  disabledInteractive = input<boolean>(false);
  rippleColor = input('rgba(0, 0, 0, 0.2)');
  rippleUnbounded = input<boolean>(false);
  rippleRadius = input<number>(0);
  rippleCentered = input<boolean>(false);
  rippleOnHover = input<boolean>(false);
  viewBox = input<string | undefined>(undefined);

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
