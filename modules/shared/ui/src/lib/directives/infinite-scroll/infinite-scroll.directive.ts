import {
  afterRenderEffect,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { hasWindowDefined } from './infinite-scroll-utils';
import {
  IInfiniteScrollAction,
  IInfiniteScrollEvent,
} from './scroll-state.model';
import { createScroller, InfiniteScrollActions } from './scroll.register';

@Directive({
  selector: '[ayInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnDestroy {
  scrolled = output<IInfiniteScrollEvent>();
  scrolledUp = output<IInfiniteScrollEvent>();

  infiniteScrollDistance = input(2);
  infiniteScrollUpDistance = input(1.5);
  infiniteScrollThrottle = input(150);
  infiniteScrollDisabled = input(false);
  infiniteScrollContainer = input<any>(null);
  scrollWindow = input(true);
  immediateCheck = input(false);
  horizontal = input(false);
  alwaysCallback = input(false);
  fromRoot = input(false);

  private element = inject(ElementRef);
  private disposeScroller?: Subscription;

  constructor() {
    afterRenderEffect({
      write: () => {
        this.infiniteScrollContainer();
        this.infiniteScrollDisabled();
        this.destroyScroller();
        if (!this.infiniteScrollDisabled()) {
          this.setup();
        }
      },
    });
    afterRenderEffect({
      write: () => {
        this.infiniteScrollDistance();
        this.destroyScroller();
        this.setup();
      },
    });
  }

  ngOnDestroy() {
    this.destroyScroller();
  }

  private setup() {
    if (!hasWindowDefined()) {
      return;
    }

    this.disposeScroller = createScroller({
      fromRoot: this.fromRoot(),
      alwaysCallback: this.alwaysCallback(),
      disable: this.infiniteScrollDisabled(),
      downDistance: this.infiniteScrollDistance(),
      element: this.element,
      horizontal: this.horizontal(),
      scrollContainer: this.infiniteScrollContainer(),
      scrollWindow: this.scrollWindow(),
      throttle: this.infiniteScrollThrottle(),
      upDistance: this.infiniteScrollUpDistance(),
    }).subscribe((payload) => this.handleOnScroll(payload));
  }

  private handleOnScroll({ type, payload }: IInfiniteScrollAction) {
    const emitter =
      type === InfiniteScrollActions.DOWN ? this.scrolled : this.scrolledUp;
    emitter.emit(payload);
  }

  private destroyScroller() {
    if (this.disposeScroller) {
      this.disposeScroller.unsubscribe();
      this.disposeScroller = undefined;
    }
  }
}
