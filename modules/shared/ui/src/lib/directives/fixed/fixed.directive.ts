import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[ayFixed]',
  standalone: true,
  host: {
    '[style.position]': "'fixed'",
    '[style.zIndex]': 'zIndex()',
    '[style.height]': 'height()',
    '[style.backgroundColor]': "'var(--white-color-trans)'",
    '[style.backdropFilter]': 'backdropFilterString()',
    '(window:resize)': 'resize()',
  },
})
export class FixedDirective {
  zIndex = input<number>(10);
  height = input.required<number>({ alias: 'ayFixed' });
  backdropFilter = input<number>(16);
  backdropFilterString = computed(() => `blur(${this.backdropFilter()}px)`);
  element: HTMLElement = inject(ElementRef).nativeElement;

  constructor() {
    effect(() => {
      this.resize();

      const nextSibling = <HTMLElement | undefined>(
        this.element.nextElementSibling
      );
      if (nextSibling) {
        nextSibling.style.marginTop = `${this.height()}px`;
      }
    });
  }

  resize() {
    const parent = this.element.parentElement;
    if (parent) {
      this.element.style.width = `${parent.offsetWidth}px`;
      const rect = parent.getBoundingClientRect();
      this.element.style.left = `${rect.left}px`;
      this.element.style.right = `${rect.right}px`;
    }
  }
}
