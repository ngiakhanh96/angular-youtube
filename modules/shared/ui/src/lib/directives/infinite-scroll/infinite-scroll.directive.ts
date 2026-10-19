import {
  afterRenderEffect,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[ayInfiniteScroll]',
  host: {
    'aria-hidden': 'true',
    class: 'block h-px',
  },
})
export class InfiniteScrollDirective {
  readonly scrolled = output<void>();
  readonly infiniteScrollDisabled = input(false);
  readonly infiniteScrollKey = input.required<string>();
  /** Distance below the viewport, in pixels, at which to request the next page. */
  readonly infiniteScrollDistance = input(400);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private requestedKey: string | undefined;

  constructor() {
    afterRenderEffect({
      read: (onCleanup) => {
        if (this.infiniteScrollDisabled()) return;

        const key = this.infiniteScrollKey();
        let active = true;
        const observer = new IntersectionObserver(
          (entries) => {
            if (!active || this.infiniteScrollDisabled()) return;

            const entry = entries[entries.length - 1];
            if (!entry) return;
            if (!entry.isIntersecting) {
              this.requestedKey = undefined;
              return;
            }
            if (this.requestedKey === key) return;

            // Rearm after progress, or after leaving and re-entering the viewport.
            this.requestedKey = key;
            this.scrolled.emit();
          },
          { rootMargin: `0px 0px ${this.infiniteScrollDistance()}px 0px` },
        );

        observer.observe(this.element.nativeElement);
        onCleanup(() => {
          active = false;
          observer.disconnect();
        });
      },
    });
  }
}
