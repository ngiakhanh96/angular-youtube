import { ElementRef } from '@angular/core';
import {
  ContainerRef,
  IPositionElements,
  IPositionStats,
  IResolver,
} from './scroll-state.model';

export function createResolver({
  windowElement: container,
  axis,
}: IPositionElements): IResolver {
  return isElementWindow(container)
    ? { axis, container, isWindow: true }
    : { axis, container, isWindow: false };
}

export function isElementWindow(container: ContainerRef): container is Window {
  return 'window' in container && container.window === container;
}

export function calculatePoints(
  element: ElementRef<HTMLElement>,
  resolver: IResolver,
): IPositionStats {
  const { axis } = resolver;
  if (resolver.isWindow) {
    const { container } = resolver;
    const height = container.document.documentElement[axis.clientHeightKey()];
    const scrollOffset = container[axis.pageYOffsetKey()];
    const host = element.nativeElement;
    const totalToScroll =
      host.getBoundingClientRect()[axis.topKey()] +
      scrollOffset +
      host[axis.offsetHeightKey()];
    return {
      height,
      scrolled: height + scrollOffset,
      totalToScroll,
      isWindow: true,
    };
  }

  const { container } = resolver;
  return {
    height: container[axis.offsetHeightKey()],
    scrolled: container[axis.scrollTopKey()],
    totalToScroll: container[axis.scrollHeightKey()],
    isWindow: false,
  };
}
