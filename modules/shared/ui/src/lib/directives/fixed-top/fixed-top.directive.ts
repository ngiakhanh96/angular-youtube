import {
  afterNextRender,
  computed,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[ayFixedTop]',
  host: {
    '[style.position]': "'fixed'",
    '[style.zIndex]': 'zIndex()',
    '[style.height]': 'height()',
    '[style.backgroundColor]': "'var(--white-color-trans)'",
    '[style.backdropFilter]': 'backdropFilterBlurString()',
    '[style.width]': 'width()',
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
  width = model<string>('100%');
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

    // This resize must run before afterNextRender resize function of overlay directive run
    afterNextRender({
      write: () => {
        this.resize();
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
      this.width.set(
        `${
          parseFloat(getComputedStyle(parent).width) -
          parseFloat(getComputedStyle(parent).paddingLeft) -
          parseFloat(getComputedStyle(parent).paddingRight)
        }px`,
      );
    }
  }
}
