import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { SvgButtonRendererComponent } from '../svg-button-renderer/svg-button-renderer.component';

@Component({
  selector: 'ay-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  standalone: true,
  imports: [SvgButtonRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  sidebarService = inject(SidebarService);

  onClick() {
    this.sidebarService.toggle();
  }
}
