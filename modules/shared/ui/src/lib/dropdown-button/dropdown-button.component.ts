import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { OverlayDirective } from '../directives/overlay/overlay.directive';
import { ISection, MenuComponent } from '../menu/menu.component';
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';

export type DropdownMode = 'horizontal' | 'vertical';

@Component({
  selector: 'ay-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss'],
  imports: [
    OverlayModule,
    MenuComponent,
    OverlayDirective,
    TextIconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--background-color]': 'backgroundColor()',
  },
})
export class DropdownButtonComponent {
  items = input.required<ISection[]>();
  mini = input(false);
  mode = input<DropdownMode>('horizontal');
  panelClass = computed(() =>
    this.mini()
      ? ['mdc-list-list-item-one-line-container-height-36px']
      : ['mdc-list-list-item-one-line-container-height-40px'],
  );
  selectedIconName = signal('');
  backgroundColor = input('unset');
  dropDownWidth = input('254px');

  dropDownButtonIcon = computed(() =>
    this.mode() === 'horizontal'
      ? 'more-options-horizontal'
      : 'more-options-vertical',
  );
}
