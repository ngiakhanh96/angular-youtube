import { ComponentRef } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  Route,
  RouteReuseStrategy,
} from '@angular/router';

export interface ICustomRouteReuseComponent {
  onStoreByRouteReuseStrategy(): void;
  shouldRetrieveByRouteReuseStrategy(): boolean;
  onRetrieveByRouteReuseStrategy(): void;
}

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedHandles = new Map<Route, DetachedRouteHandle | null>();

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (route.queryParams['v']) {
      return true;
    }
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (!route.routeConfig || !handle) {
      return;
    }
    // if (this.storedHandles.has(route.routeConfig)) {
    //   this.deleteFromStoredHandles(route);
    // }
    this.storedHandles.set(route.routeConfig, handle);
    const component: ICustomRouteReuseComponent | undefined =
      this.getComponentRefFromHandle(handle)?.instance;
    if (component && component.onStoreByRouteReuseStrategy) {
      component.onStoreByRouteReuseStrategy();
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return (
      !!route.queryParams['v'] &&
      !!route.routeConfig &&
      this.storedHandles.has(route.routeConfig)
    );
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig || !this.storedHandles.has(route.routeConfig)) {
      return null;
    }
    const handle = this.storedHandles.get(route.routeConfig)!;
    const componentRef = this.getComponentRefFromHandle(handle);
    const component: ICustomRouteReuseComponent | undefined =
      componentRef?.instance;
    if (
      component &&
      component.shouldRetrieveByRouteReuseStrategy() &&
      component.onRetrieveByRouteReuseStrategy
    ) {
      component.onRetrieveByRouteReuseStrategy();
      return handle;
    }
    this.storedHandles.delete(route.routeConfig);
    componentRef?.destroy();
    return null;
  }

  private deleteFromStoredHandles(route: ActivatedRouteSnapshot): void {
    if (!route.routeConfig || !this.storedHandles.has(route.routeConfig)) {
      return;
    }
    const handle = this.storedHandles.get(route.routeConfig)!;
    const componentRef = this.getComponentRefFromHandle(handle);
    this.storedHandles.delete(route.routeConfig);
    componentRef?.destroy();
  }

  private getComponentRefFromHandle(
    handle: DetachedRouteHandle,
  ): ComponentRef<any> {
    return (handle as any).componentRef;
  }
}
