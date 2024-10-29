import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ay-sidebar-section-header',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-section-header.component.html',
  styleUrl: './sidebar-section-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSectionHeaderComponent {
  displayText = input();
  viewBox = input();
  path = input();
}
