import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import {
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '../svg-button-renderer/svg-button-renderer.component';
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';

@Component({
  selector: 'ay-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  imports: [
    SvgButtonRendererComponent,
    SvgButtonTemplateDirective,
    TextIconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HamburgerButtonComponent {
  sidebarService = inject(SidebarService);

  onClick() {
    this.sidebarService.toggle();
  }
}
