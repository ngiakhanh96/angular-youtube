import {
  Directive,
  effect,
  inject,
  input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { DynamicComponentService } from '../../services/dynamic-component.service';
import { AySkeletonLoaderComponent } from '../../skeleton-loader/skeleton-loader.component';

@Directive({
  selector: '[aySkeleton]',
})
export class SkeletonDirective {
  isSkeleton = input.required<boolean>({ alias: 'aySkeleton' });
  appearance = input('line', { alias: 'aySkeletonAppearance' });
  theme = input({}, { alias: 'aySkeletonTheme' });
  classes = input<string[]>([], { alias: 'aySkeletonClasses' });
  viewContainerRef = inject(ViewContainerRef);
  templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  dynamicComponentService = inject(DynamicComponentService);
  renderer2 = inject(Renderer2);
  hasSkeletonComponent = false;

  constructor() {
    effect(() => {
      if (this.isSkeleton() && !this.hasSkeletonComponent) {
        this.hasSkeletonComponent = true;
        this.viewContainerRef.clear();
        const skeletonComponent = this.dynamicComponentService.createComponent(
          AySkeletonLoaderComponent,
          {
            appearance: this.appearance(),
            theme: this.theme(),
          },
          undefined,
          this.viewContainerRef,
        );
        for (const className of this.classes()) {
          this.renderer2.addClass(
            skeletonComponent.location.nativeElement,
            className,
          );
        }
      } else if (!this.isSkeleton()) {
        if (this.hasSkeletonComponent) {
          this.hasSkeletonComponent = false;
          this.viewContainerRef.clear();
        }
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
