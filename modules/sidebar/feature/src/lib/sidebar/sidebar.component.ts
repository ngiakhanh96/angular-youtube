import { LogoMenuComponent } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ay-sidebar',
  standalone: true,
  imports: [LogoMenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}
