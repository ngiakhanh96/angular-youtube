import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { IconDirective } from '../directives/icon/icon.directive';
import { SectionItemDirective } from '../directives/section-item/section-item.directive';
import { MenuSectionHeaderComponent } from '../menu-section-header/menu-section-header.component';
import { ISection } from '../menu/menu.component';
import { SectionItemContentComponent } from '../section-item-content/section-item-content.component';

export interface ISectionItem {
  iconName: string;
  displayText: string;
}

@Component({
  selector: 'ay-menu-section',
  templateUrl: './menu-section.component.html',
  styleUrls: ['./menu-section.component.scss'],
  imports: [
    MatListModule,
    MatIconModule,
    IconDirective,
    SectionItemDirective,
    SectionItemContentComponent,
    MenuSectionHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSectionComponent {
  sectionItems = input.required<ISection>();
  sectionItemsList = computed(() => this.sectionItems().sectionItems);
  sectionItemsHeader = computed(() => this.sectionItems().header);
  selectedIconName = model<string>();

  onClick(iconName: string) {
    this.selectedIconName.set(iconName);
  }
}