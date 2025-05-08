import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { OverlayDirective } from '../directives/overlay/overlay.directive';
import { ISection, MenuComponent } from '../menu/menu.component';
import { SvgButtonRendererComponent } from '../svg-button-renderer/svg-button-renderer.component';

export type DropdownMode = 'horizontal' | 'vertical';

@Component({
  selector: 'ay-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss'],
  imports: [
    SvgButtonRendererComponent,
    OverlayModule,
    MenuComponent,
    OverlayDirective,
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
  isOpenedSettingsMenu = signal(false);
  buttonRenderer = viewChild.required<
    SvgButtonRendererComponent,
    CdkOverlayOrigin
  >(SvgButtonRendererComponent, { read: CdkOverlayOrigin });
  backgroundColor = input('unset');
  dropDownWidth = input('254px');
}
