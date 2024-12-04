import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import {
  SvgButtonRendererComponent,
  SvgButtonTemplateDirective,
} from '../svg-button-renderer/svg-button-renderer.component';

@Component({
  selector: 'ay-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  standalone: true,
  imports: [SvgButtonRendererComponent, SvgButtonTemplateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HamburgerButtonComponent {
  sidebarService = inject(SidebarService);

  onClick() {
    this.sidebarService.toggle();
  }
}
