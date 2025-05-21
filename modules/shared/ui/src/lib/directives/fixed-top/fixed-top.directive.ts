import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[ayFixedTop]',
  standalone: true,
  host: {
    '[style.position]': "'fixed'",
    '[style.zIndex]': 'zIndex()',
    '[style.height]': 'height()',
    '[style.backgroundColor]': "'var(--white-color-trans)'",
    '[style.backdropFilter]': 'backdropFilterBlurString()',
    '(window:resize)': 'resize()',
  },
})
export class FixedTopDirective {
  zIndex = input<string>('var(--layer-1)');
  height = input.required<number>({ alias: 'ayFixedTop' });
  backdropFilterBlurPx = input<number>(16);
  backdropFilterBlurString = computed(
    () => `blur(${this.backdropFilterBlurPx()}px)`,
  );
  element: HTMLElement = inject(ElementRef).nativeElement;
  document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      const nextSibling = <HTMLElement | undefined>(
        this.element.nextElementSibling
      );
      if (nextSibling) {
        nextSibling.style.marginTop = `${this.height()}px`;
      }
    });
    //This resize must run before afterNextRender resize function of overlay directive run
    afterNextRender({
      write: () => {
        this.resize();
      },
    });
  }

  resize() {
    const parent = this.element.parentElement;
    if (parent) {
      this.element.style.width = `${parent.offsetWidth}px`;
      this.element.style.left = `${parent.getBoundingClientRect().left}px`;
    }
  }
}
