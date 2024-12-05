import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { SectionItemDirective } from '../directives/section-item/section-item.directive';

@Component({
    selector: 'ay-section-item-content',
    imports: [MatListModule],
    templateUrl: './section-item-content.component.html',
    styleUrl: './section-item-content.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionItemContentComponent {
  displayText = input.required<string>();
  matListItem = inject(SectionItemDirective);
  shouldHighlight = computed(() => this.matListItem.shouldHighlight());
}
