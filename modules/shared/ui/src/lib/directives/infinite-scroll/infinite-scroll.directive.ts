import {
  afterRenderEffect,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';
import {
  IInfiniteScrollAction,
  IInfiniteScrollEvent,
  ScrollContainer,
} from './scroll-state.model';
import { createScroller, InfiniteScrollActions } from './scroll.register';

@Directive({
  selector: '[ayInfiniteScroll]',
})
export class InfiniteScrollDirective {
  scrolled = output<IInfiniteScrollEvent>();
  scrolledUp = output<IInfiniteScrollEvent>();

  infiniteScrollDistance = input(2);
  infiniteScrollUpDistance = input(1.5);
  infiniteScrollThrottle = input(150);
  infiniteScrollDisabled = input(false);
  infiniteScrollContainer = input<ScrollContainer>(null);
  scrollWindow = input(true);
  immediateCheck = input(false);
  horizontal = input(false);
  alwaysCallback = input(false);
  fromRoot = input(false);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterRenderEffect({
      read: (onCleanup) => {
        if (!this.infiniteScrollDisabled()) {
          const subscription = this.setup();
          onCleanup(() => subscription.unsubscribe());
        }
      },
    });
  }

  private setup() {
    const config = {
      fromRoot: this.fromRoot(),
      alwaysCallback: this.alwaysCallback(),
      disable: this.infiniteScrollDisabled(),
      downDistance: this.infiniteScrollDistance(),
      element: this.element,
      horizontal: this.horizontal(),
      immediateCheck: this.immediateCheck(),
      scrollContainer: this.infiniteScrollContainer(),
      scrollWindow: this.scrollWindow(),
      throttle: this.infiniteScrollThrottle(),
      upDistance: this.infiniteScrollUpDistance(),
    };
    return untracked(() =>
      createScroller(config).subscribe((action) => this.handleOnScroll(action)),
    );
  }

  private handleOnScroll({ type, payload }: IInfiniteScrollAction) {
    if (this.infiniteScrollDisabled()) return;

    const emitter =
      type === InfiniteScrollActions.DOWN ? this.scrolled : this.scrolledUp;
    emitter.emit(payload);
  }
}
