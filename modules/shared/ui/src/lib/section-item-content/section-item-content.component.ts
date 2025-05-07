import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer } from '@angular/platform-browser';
import { SectionItemDirective } from '../directives/section-item/section-item.directive';

@Component({
  selector: 'ay-section-item-content',
  imports: [MatListModule],
  templateUrl: './section-item-content.component.html',
  styleUrl: './section-item-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionItemContentComponent {
  displayHtml = input.required<string>();
  sanitizer = inject(DomSanitizer);
  matListItem = inject(SectionItemDirective);
  sanitizedDisplayHtml = computed(() => {
    return this.sanitizer.bypassSecurityTrustHtml(this.displayHtml());
  });
  shouldHighlight = computed(() => this.matListItem.shouldHighlight());
}
