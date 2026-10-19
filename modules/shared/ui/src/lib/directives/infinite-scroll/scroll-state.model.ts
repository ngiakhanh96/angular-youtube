import { ElementRef } from '@angular/core';
import { AxisResolver } from './axis-resolver';

export type ContainerRef = Window | HTMLElement;
export type ScrollContainer =
  | ContainerRef
  | ElementRef<HTMLElement>
  | string
  | null;

export interface IInfiniteScrollEvent {
  currentScrollPosition: number;
}

export interface IPositionElements {
  windowElement: ContainerRef;
  axis: AxisResolver;
}

export interface IPositionStats {
  height: number;
  scrolled: number;
  totalToScroll: number;
  isWindow?: boolean;
}
export interface IScrollerDistance {
  down?: number;
  up?: number;
}

export interface IScrollState {
  lastTotalToScroll: number;
  totalToScroll: number;
  triggered: IScrollerDistance;
  lastScrollPosition: number;
}

export type IResolver = { axis: AxisResolver } & (
  | { container: Window; isWindow: true }
  | { container: HTMLElement; isWindow: false }
);

export interface IScrollRegisterConfig {
  container: ContainerRef;
  throttle: number;
}

export interface IScroller {
  fromRoot: boolean;
  horizontal: boolean;
  disable: boolean;
  throttle: number;
  scrollWindow: boolean;
  element: ElementRef<HTMLElement>;
  scrollContainer: ScrollContainer;
  immediateCheck: boolean;
  alwaysCallback: boolean;
  downDistance: number;
  upDistance: number;
}

export interface IScrollParams {
  scrollDown: boolean;
  fire: boolean;
  stats: IPositionStats;
}

export interface IInfiniteScrollAction {
  type: '[NGX_ISE] DOWN' | '[NGX_ISE] UP';
  payload: IInfiniteScrollEvent;
}

export class ScrollState implements IScrollState {
  lastScrollPosition = 0;
  lastTotalToScroll = 0;
  totalToScroll = 0;
  triggered: IScrollerDistance = {
    down: 0,
    up: 0,
  };

  constructor(attrs: Partial<ScrollState>) {
    Object.assign(this, attrs);
  }

  updateScrollPosition(position: number) {
    return (this.lastScrollPosition = position);
  }

  updateTotalToScroll(totalToScroll: number) {
    if (this.lastTotalToScroll !== totalToScroll) {
      this.lastTotalToScroll = this.totalToScroll;
      this.totalToScroll = totalToScroll;
    }
  }

  updateScroll(scrolledUntilNow: number, totalToScroll: number) {
    this.updateScrollPosition(scrolledUntilNow);
    this.updateTotalToScroll(totalToScroll);
  }

  updateTriggeredFlag(scroll: number, isScrollingDown: boolean) {
    if (isScrollingDown) {
      this.triggered.down = scroll;
    } else {
      this.triggered.up = scroll;
    }
  }

  isTriggeredScroll(totalToScroll: number, isScrollingDown: boolean) {
    return isScrollingDown
      ? this.triggered.down === totalToScroll
      : this.triggered.up === totalToScroll;
  }
}
