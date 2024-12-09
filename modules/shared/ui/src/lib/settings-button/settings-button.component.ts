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
import { SvgButtonRendererComponent } from '../svg-button-renderer/svg-button-renderer.component';

@Component({
  selector: 'ay-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
  imports: [
    SvgButtonRendererComponent,
    OverlayModule,
    MenuComponent,
    OverlayDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsButtonComponent {
  items = input.required<ISection[]>();
  mini = input(false);
  panelClass = computed(() =>
    this.mini()
      ? ['mdc-list-list-item-one-line-container-height-36px']
      : ['mdc-list-list-item-one-line-container-height-40px'],
  );
  selectedIconName = signal('');
  isOpenedSettingsMenu = signal(false);

  onClickSettings() {
    this.isOpenedSettingsMenu.update((v) => !v);
  }

  onOverlayOutsideClick() {
    this.isOpenedSettingsMenu.update((v) => !v);
  }
}
