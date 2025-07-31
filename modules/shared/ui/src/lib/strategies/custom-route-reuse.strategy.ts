import { ComponentRef, Injectable, signal } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export interface ICustomRouteReuseComponent {
  onStoreByRouteReuseStrategy(): void;
  shouldRetrieveByRouteReuseStrategy(route: ActivatedRouteSnapshot): boolean;
  onRetrieveByRouteReuseStrategy(): void;
}

@Injectable({
  providedIn: 'root',
})
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private _originalVideoUrlString = signal<string | undefined>(undefined);
  private _cachedComponentNames = new Set<string>();
  private _storedHandles = new Map<string, DetachedRouteHandle | null>();

  setOriginalVideoUrl(url: string): void {
    this._originalVideoUrlString.set(url);
  }

  getOriginalVideoUrl(): string | undefined {
    return this._originalVideoUrlString();
  }

  registerCachedComponentName(componentName: string): void {
    this._cachedComponentNames.add(componentName);
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (
      route.routeConfig?.component?.name &&
      this._cachedComponentNames.has(route.routeConfig.component.name)
    ) {
      return true;
    }
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (!route.routeConfig?.component?.name || !handle) {
      return;
    }

    if (
      this._storedHandles.has(route.routeConfig.component.name) &&
      this.getComponentRefFromHandle(
        this._storedHandles.get(route.routeConfig.component.name),
      ) !== this.getComponentRefFromHandle(handle)
    ) {
      const handle = this._storedHandles.get(route.routeConfig.component.name)!;
      const componentRef = this.getComponentRefFromHandle(handle);
      this._storedHandles.delete(route.routeConfig.component.name);
      componentRef?.destroy();
    }

    this._storedHandles.set(route.routeConfig.component.name, handle);
    const component: ICustomRouteReuseComponent =
      this.getComponentRefFromHandle(handle).instance;
    if (component.onStoreByRouteReuseStrategy) {
      component.onStoreByRouteReuseStrategy();
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (
      !!route.routeConfig?.component?.name &&
      this._cachedComponentNames.has(route.routeConfig.component.name) &&
      this._storedHandles.has(route.routeConfig.component.name)
    ) {
      const handle = this._storedHandles.get(route.routeConfig.component.name)!;
      const componentRef = this.getComponentRefFromHandle(handle);
      const component: ICustomRouteReuseComponent = componentRef.instance;
      if (component.shouldRetrieveByRouteReuseStrategy?.(route)) {
        return true;
      }

      this._storedHandles.delete(route.routeConfig.component.name);
      componentRef.destroy();
      return false;
    }
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (
      !route.routeConfig?.component?.name ||
      !this._storedHandles.has(route.routeConfig.component.name)
    ) {
      return null;
    }
    const handle = this._storedHandles.get(route.routeConfig.component.name)!;
    const componentRef = this.getComponentRefFromHandle(handle);
    const component: ICustomRouteReuseComponent = componentRef.instance;
    component.onRetrieveByRouteReuseStrategy?.();
    return handle;
  }

  private getComponentRefFromHandle<T extends DetachedRouteHandle>(
    handle?: T | null,
  ): T extends DetachedRouteHandle ? ComponentRef<any> : undefined {
    return (handle as any)?.componentRef;
  }
}
