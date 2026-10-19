import {
  EMPTY,
  filter,
  fromEvent,
  map,
  Observable,
  startWith,
  tap,
  throttleTime,
} from 'rxjs';

import { AxisResolver } from './axis-resolver';
import { shouldTriggerEvents } from './event-trigger';
import { resolveContainerElement } from './infinite-scroll-utils';
import { calculatePoints, createResolver } from './position-resolver';
import { getScrollStats } from './scroll-resolver';
import {
  IInfiniteScrollAction,
  IPositionStats,
  IScroller,
  IScrollerDistance,
  IScrollParams,
  IScrollRegisterConfig,
  ScrollState,
} from './scroll-state.model';

export function createScroller(
  config: IScroller,
): Observable<IInfiniteScrollAction> {
  if (config.disable) return EMPTY;

  const { scrollContainer, scrollWindow, element, fromRoot } = config;
  const resolver = createResolver({
    axis: new AxisResolver(!config.horizontal),
    windowElement: resolveContainerElement(
      scrollContainer,
      scrollWindow,
      element,
      fromRoot,
    ),
  });
  const scrollState = new ScrollState({
    totalToScroll: calculatePoints(element, resolver).totalToScroll,
  });
  const options: IScrollRegisterConfig = {
    container: resolver.container,
    throttle: config.throttle,
  };
  const distance = {
    up: config.upDistance,
    down: config.downDistance,
  };
  const scrollEvents = attachScrollEvent(options);
  const events = config.immediateCheck
    ? scrollEvents.pipe(startWith(null))
    : scrollEvents;

  return events.pipe(
    map((event) => {
      const stats = calculatePoints(element, resolver);
      return toInfiniteScrollParams(
        event === null ? stats.scrolled - 1 : scrollState.lastScrollPosition,
        stats,
        distance,
      );
    }),
    tap(({ stats }) =>
      scrollState.updateScroll(stats.scrolled, stats.totalToScroll),
    ),
    filter(({ fire, scrollDown, stats: { totalToScroll } }) =>
      shouldTriggerEvents(
        config.alwaysCallback,
        fire,
        scrollState.isTriggeredScroll(totalToScroll, scrollDown),
      ),
    ),
    tap(({ scrollDown, stats: { totalToScroll } }) => {
      scrollState.updateTriggeredFlag(totalToScroll, scrollDown);
    }),
    map(toInfiniteScrollAction),
  );
}

export function attachScrollEvent(
  options: IScrollRegisterConfig,
): Observable<Event> {
  let obs = fromEvent<Event>(options.container, 'scroll', { passive: true });
  if (options.throttle > 0) {
    obs = obs.pipe(
      throttleTime(options.throttle, undefined, {
        leading: true,
        trailing: true,
      }),
    );
  }
  return obs;
}

export function toInfiniteScrollParams(
  lastScrollPosition: number,
  stats: IPositionStats,
  distance: IScrollerDistance,
): IScrollParams {
  const { scrollDown, fire } = getScrollStats(
    lastScrollPosition,
    stats,
    distance,
  );
  return {
    scrollDown,
    fire,
    stats,
  };
}

export const InfiniteScrollActions = {
  DOWN: '[NGX_ISE] DOWN',
  UP: '[NGX_ISE] UP',
} as const;

export function toInfiniteScrollAction(
  response: IScrollParams,
): IInfiniteScrollAction {
  const {
    scrollDown,
    stats: { scrolled: currentScrollPosition },
  } = response;
  return {
    type: scrollDown ? InfiniteScrollActions.DOWN : InfiniteScrollActions.UP,
    payload: {
      currentScrollPosition,
    },
  };
}
