import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import {
  ISectionItem,
  MenuSectionComponent,
} from '../menu-section/menu-section.component';

export interface ISection {
  header?: string;
  sectionItems: ISectionItem[];
}

@Component({
  selector: 'ay-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [MenuSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  items = input.required<ISection[]>();
  selectedIconName = model<string>();
}
