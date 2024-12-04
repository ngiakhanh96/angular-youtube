import { computed, Directive, input, signal } from '@angular/core';

@Directive({
  selector: 'mat-list-item[aySectionItem]',
  host: {
    '[style.backgroundColor]': "shouldHighlight() ? '#0000000d' : 'unset'",
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  standalone: true,
})
export class SectionItemDirective {
  isSelected = input<boolean>(false, { alias: 'aySectionItem' });
  isHovered = signal(false);
  shouldHighlight = computed(() => this.isSelected() || this.isHovered());

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }
}
