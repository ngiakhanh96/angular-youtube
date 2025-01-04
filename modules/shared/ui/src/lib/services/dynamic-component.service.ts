import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  inject,
  Injectable,
  Injector,
  Type,
} from '@angular/core';
import { LinkComponent } from '../link/link.component';

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
  ): ComponentRef<T> {
    const componentName = component.name.replace('_', '');
    const componentFactory =
      this.componentFactories.get(componentName) ??
      this.componentFactoryResolver.resolveComponentFactory(component);
    this.componentFactories.set(componentName, componentFactory);
    return this.createComponentFromFactory(componentFactory, inputs, injector);
  }

  async createComponentLazily(
    component: () => Promise<any>,
    componentName: string,
    inputs?: Record<string, any>,
    injector?: Injector,
  ): Promise<ComponentRef<any>> {
    LinkComponent;
    const componentFactory =
      this.componentFactories.get(componentName) ??
      this.componentFactoryResolver.resolveComponentFactory(
        await component().then((m) => m[componentName] as Type<any>),
      );
    this.componentFactories.set(componentName, componentFactory);
    return this.createComponentFromFactory(componentFactory, inputs, injector);
  }

  createComponentFromFactory<T>(
    componentFactory: ComponentFactory<T>,
    inputs?: Record<string, any>,
    injector?: Injector,
  ) {
    const componentRef = componentFactory.create(
      injector ?? this.appRef.injector,
    );
    this.appRef.attachView(componentRef.hostView);
    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        componentRef.setInput(key, value);
      }
    }
    return componentRef;
  }

  destroyComponent<T>(componentRef: ComponentRef<T>): void {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
