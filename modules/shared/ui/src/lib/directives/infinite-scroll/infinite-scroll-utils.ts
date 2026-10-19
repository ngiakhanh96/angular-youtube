import { ElementRef } from '@angular/core';
import { ContainerRef, ScrollContainer } from './scroll-state.model';

export function resolveContainerElement(
  selector: ScrollContainer,
  scrollWindow: boolean,
  defaultElement: ElementRef<HTMLElement>,
  fromRoot: boolean,
): ContainerRef {
  const element = defaultElement.nativeElement;
  if (typeof selector === 'string' && selector) {
    const container = findElement(selector, element, fromRoot);
    if (!container) {
      throw new Error(
        'ayInfiniteScroll: no scroll container matches "' + selector + '".',
      );
    }
    return container;
  }
  if (selector instanceof ElementRef) return selector.nativeElement;
  if (selector && typeof selector !== 'string') return selector;

  return scrollWindow
    ? (element.ownerDocument.defaultView ?? element)
    : element;
}

export function findElement(
  selector: string,
  customRoot: HTMLElement,
  fromRoot: boolean,
): HTMLElement | null {
  const root = fromRoot ? customRoot.ownerDocument : customRoot;
  return root.querySelector<HTMLElement>(selector);
}
