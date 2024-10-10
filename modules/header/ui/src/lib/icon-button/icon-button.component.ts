import {
  SidebarService,
  SvgButtonRendererComponent,
} from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

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
