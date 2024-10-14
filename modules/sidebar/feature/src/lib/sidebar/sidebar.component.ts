import { IconDirective, LogoMenuComponent } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'ay-sidebar',
  standalone: true,
  imports: [LogoMenuComponent, MatListModule, MatIconModule, IconDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  messages = signal([
    {
      from: 'test',
      subject: 'test',
      content: 'test',
    },
  ]);
}
