import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[ayFixedTop]',
  standalone: true,
  host: {
    '[style.position]': "'absolute'",
    '[style.zIndex]': 'zIndex()',
    '[style.height]': 'height()',
    '[style.backgroundColor]': "'var(--white-color-trans)'",
    '[style.backdropFilter]': 'backdropFilterBlurString()',
    '(window:resize)': 'resize()',
  },
})
export class FixedTopDirective implements OnDestroy {
  zIndex = input<string>('var(--layer-1)');
  height = input.required<number>({ alias: 'ayFixedTop' });
  backdropFilterBlurPx = input<number>(16);
  backdropFilterBlurString = computed(
    () => `blur(${this.backdropFilterBlurPx()}px)`,
  );
  element: HTMLElement = inject(ElementRef).nativeElement;
  document = inject(DOCUMENT);
  resizeObserver: ResizeObserver | undefined;

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
        this.element.parentElement!.style.position = 'relative';
        this.resizeObserver = new ResizeObserver((_) => {
          this.resize();
        });
        this.resizeObserver.observe(this.element.parentElement!);
      },
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  resize() {
    const parent = this.element.parentElement;
    if (parent) {
      this.element.style.width = `${parseFloat(getComputedStyle(parent).width) - parseFloat(getComputedStyle(parent).paddingLeft) - parseFloat(getComputedStyle(parent).paddingRight)}px`;
    }
  }
}
