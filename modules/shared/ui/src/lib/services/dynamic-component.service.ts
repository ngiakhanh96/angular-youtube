import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  inject,
  Injectable,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicComponentService {
  appRef = inject(ApplicationRef);
  componentFactoryResolver = inject(ComponentFactoryResolver);
  componentFactories = new Map<string, ComponentFactory<any>>();

  createComponent<T>(
    component: Type<T>,
    inputs?: Record<string, any>,
    injector?: Injector,
    viewContainerRef?: ViewContainerRef,
  ): ComponentRef<T> {
    const componentName = component.name.replace('_', '');
    const componentFactory =
      this.componentFactories.get(componentName) ??
      this.componentFactoryResolver.resolveComponentFactory(component);
    this.componentFactories.set(componentName, componentFactory);
    return this.createComponentFromFactory(
      componentFactory,
      inputs,
      injector,
      viewContainerRef,
    );
  }

  async createComponentLazily(
    component: () => Promise<any>,
    componentName: string,
    inputs?: Record<string, any>,
    injector?: Injector,
    viewContainerRef?: ViewContainerRef,
  ): Promise<ComponentRef<any>> {
    const componentFactory =
      this.componentFactories.get(componentName) ??
      this.componentFactoryResolver.resolveComponentFactory(
        await component().then((m) => m[componentName] as Type<any>),
      );
    this.componentFactories.set(componentName, componentFactory);
    return this.createComponentFromFactory(
      componentFactory,
      inputs,
      injector,
      viewContainerRef,
    );
  }

  createComponentFromFactory<T>(
    componentFactory: ComponentFactory<T>,
    inputs?: Record<string, any>,
    injector?: Injector,
    viewContainerRef?: ViewContainerRef,
  ) {
    const componentRef = componentFactory.create(
      injector ?? this.appRef.injector,
    );
    if (viewContainerRef) {
      viewContainerRef.insert(componentRef.hostView);
    } else {
      this.appRef.attachView(componentRef.hostView);
    }
    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        componentRef.setInput(key, value);
      }
    }
    return componentRef;
  }

  destroyComponent<T>(
    componentRef: ComponentRef<T>,
    viewContainerRef?: ViewContainerRef,
  ): void {
    if (viewContainerRef) {
      viewContainerRef.detach(viewContainerRef.indexOf(componentRef.hostView));
    } else {
      this.appRef.detachView(componentRef.hostView);
    }
    componentRef.destroy();
  }
}
