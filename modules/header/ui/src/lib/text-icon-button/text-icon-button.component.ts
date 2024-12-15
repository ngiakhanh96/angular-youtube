import { IconDirective } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ay-text-icon-button',
  templateUrl: './text-icon-button.component.html',
  styleUrls: ['./text-icon-button.component.scss'],
  imports: [MatButtonModule, MatIconModule, IconDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--color]': 'color()',
    '[style.--margin-right]': 'marginRight()',
    '[style.--background-color]': 'backgroundColor()',
    '[style.--hover-background-color]': 'hoverBackgroundColor()',
    '[style.--border]': 'border()',
  },
})
export class TextIconButtonComponent {
  displayText = input.required<string>();
  svgIcon = input.required<string>();
  color = input<string>('black');
  marginRight = input<string>('0px');
  backgroundColor = input<string>('rgba(0, 0, 0, 0.05)');
  hoverBackgroundColor = input<string>('rgba(0, 0, 0, 0.1)');
  border = input<string>('none');
}
