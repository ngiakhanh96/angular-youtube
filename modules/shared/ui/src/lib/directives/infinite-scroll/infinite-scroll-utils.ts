import { ElementRef } from '@angular/core';

export function resolveContainerElement(
  selector: string | any,
  scrollWindow: boolean,
  defaultElement: ElementRef<any>,
  fromRoot: boolean,
): any {
  const hasWindow =
    window && !!window.document && window.document.documentElement;
  let container = hasWindow && scrollWindow ? window : defaultElement;
  if (selector) {
    const containerIsString =
      selector && hasWindow && typeof selector === 'string';
    container = containerIsString
      ? findElement(selector, defaultElement.nativeElement, fromRoot)
      : selector;
    if (!container) {
      throw new Error(
        'ngx-infinite-scroll {resolveContainerElement()}: selector for',
      );
    }
  }
  return container;
}

export function findElement(
  selector: string | any,
  customRoot: ElementRef | any,
  fromRoot: boolean,
) {
  const rootEl = fromRoot ? window.document : customRoot;
  return rootEl.querySelector(selector);
}

export function hasWindowDefined(): boolean {
  return typeof window !== 'undefined';
}
