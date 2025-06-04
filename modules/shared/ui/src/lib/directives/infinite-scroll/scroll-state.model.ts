import { ElementRef } from '@angular/core';

export type ContainerRef = Window | ElementRef | any;

export interface IInfiniteScrollEvent {
  currentScrollPosition: number;
}

export interface IPositionElements {
  windowElement: ContainerRef;
  axis: any;
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

export interface IResolver {
  container: ContainerRef;
  isWindow: boolean;
  axis: any;
}

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
  element: ElementRef;
  scrollContainer: string | ElementRef;
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
  type: string;
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
