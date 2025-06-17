import {
  ApplicationRef,
  Binding,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  inputBinding,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicComponentService {
  appRef = inject(ApplicationRef);
  componentTypes = new Map<string, Type<any>>();
  environmentInjector = inject(EnvironmentInjector);

  createComponent<T>(
    componentType: Type<T>,
    inputs?: Record<string, unknown>,
    injector?: Injector,
    viewContainerRef?: ViewContainerRef,
  ): ComponentRef<T> {
    return this.createComponentFromComponentType(
      componentType,
      inputs,
      injector,
      viewContainerRef,
    );
  }

  async createComponentLazily(
    component: () => Promise<any>,
    componentName: string,
    inputs?: Record<string, unknown>,
    injector?: Injector,
    viewContainerRef?: ViewContainerRef,
  ): Promise<ComponentRef<any>> {
    const componentType = await this.loadComponentLazily(
      component,
      componentName,
    );
    return this.createComponentFromComponentType(
      componentType,
      inputs,
      injector,
      viewContainerRef,
    );
  }

  createComponentFromComponentType(
    componentType: Type<any>,
    inputs?: Record<string, unknown>,
    injector?: Injector,
    viewContainerRef?: ViewContainerRef,
  ) {
    const inputArr: Binding[] = [];
    if (inputs) {
      for (const [key, value] of Object.entries(inputs)) {
        inputArr.push(inputBinding(key, () => value));
      }
    }
    const componentRef = createComponent(componentType, {
      environmentInjector: this.environmentInjector,
      elementInjector: injector ?? this.appRef.injector,
      hostElement: undefined,
      bindings: [...inputArr],
    });
    if (viewContainerRef) {
      viewContainerRef.insert(componentRef.hostView);
    } else {
      this.appRef.attachView(componentRef.hostView);
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

  private async loadComponentLazily(
    component: () => Promise<any>,
    componentName: string,
  ) {
    let componentType = this.componentTypes.get(componentName);
    if (componentType) {
      return componentType;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    componentType = (await component().then(
      (m) => m[componentName] as Type<any>,
    ))!;
    this.componentTypes.set(componentName, componentType);
    return componentType;
  }
}
