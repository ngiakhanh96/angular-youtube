import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';

@Component({
  selector: 'ay-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss'],
  imports: [TextIconButtonComponent],
})
export class HamburgerButtonComponent {
  sidebarService = inject(SidebarService);

  onClick() {
    this.sidebarService.toggle();
  }
}
