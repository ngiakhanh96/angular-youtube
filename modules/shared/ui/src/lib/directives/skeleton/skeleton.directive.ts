import {
  ComponentRef,
  Directive,
  effect,
  inject,
  input,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { DynamicComponentService } from '../../services/dynamic-component.service';

@Directive({
  selector: '[aySkeleton]',
  standalone: true,
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
  skeletonComponent: ComponentRef<NgxSkeletonLoaderComponent> | undefined;

  constructor() {
    effect(() => {
      if (this.isSkeleton()) {
        this.viewContainerRef.clear();
        if (this.skeletonComponent) {
          this.viewContainerRef.insert(this.skeletonComponent.hostView);
        } else {
          this.skeletonComponent = this.dynamicComponentService.createComponent(
            NgxSkeletonLoaderComponent,
            {
              appearance: this.appearance(),
              theme: this.theme(),
            },
            undefined,
            this.viewContainerRef,
          );
          for (const className of this.classes()) {
            this.renderer2.addClass(
              this.skeletonComponent.location.nativeElement,
              className,
            );
            this.renderer2.setStyle(
              this.skeletonComponent.location.nativeElement,
              'width',
              '100%',
            );
            this.renderer2.setStyle(
              this.skeletonComponent.location.nativeElement,
              'height',
              '100%',
            );
            this.renderer2.setStyle(
              this.skeletonComponent.location.nativeElement,
              'display',
              'block',
            );
          }
        }
      } else {
        if (this.skeletonComponent) {
          this.viewContainerRef.detach(
            this.viewContainerRef.indexOf(this.skeletonComponent.hostView),
          );
        }
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
