import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { SvgButtonRendererComponent } from '../svg-button-renderer/svg-button-renderer.component';

@Component({
  selector: 'ay-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  standalone: true,
  imports: [SvgButtonRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HamburgerButtonComponent {
  sidebarService = inject(SidebarService);

  onClick() {
    this.sidebarService.toggle();
  }
}
