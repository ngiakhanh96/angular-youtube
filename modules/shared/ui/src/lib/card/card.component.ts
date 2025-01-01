import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--backgroundColor]': 'backgroundColor()',
    '[style.--padding]': 'padding()',
  },
})
export class CardComponent {
  backgroundColor = input('rgba(0, 0, 0, 0.05)');
  padding = input('12px');
}
