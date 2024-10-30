import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { SidebarItemDirective } from '../sidebar-item/sidebar-item.directive';

@Component({
  selector: 'ay-sidebar-item-content',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './sidebar-item-content.component.html',
  styleUrl: './sidebar-item-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarItemContentComponent {
  displayText = input.required<string>();
  matListItem = inject(SidebarItemDirective);
  shouldHighlight = computed(() => this.matListItem.shouldHighlight());
}
