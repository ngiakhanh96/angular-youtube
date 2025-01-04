import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { DynamicComponentService } from '../services/dynamic-component.service';

@Component({
  selector: 'ay-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--backgroundColor]': 'backgroundColor()',
    '[style.--padding]': 'padding()',
  },
})
export class CardComponent implements OnDestroy {
  backgroundColor = input('rgba(0, 0, 0, 0.05)');
  padding = input('12px');
  cardContainer = viewChild.required<ElementRef<HTMLElement>>('cardContainer');
  linkComponentRefs: ComponentRef<unknown>[] = [];
  dynamicComponentService = inject(DynamicComponentService);

  constructor() {
    afterNextRender(async () => {
      const cardContainerElement = this.cardContainer().nativeElement;
      const aTags = Array.from(cardContainerElement.getElementsByTagName('a'));
      for (const aTag of aTags) {
        const linkComponentRef =
          await this.dynamicComponentService.createComponentLazily(
            () => import('../link/link.component'),
            'LinkComponent',
            {
              href: aTag.href,
              attributeHref: aTag.getAttribute('href') ?? '',
              text: aTag.textContent,
            },
          );
        this.linkComponentRefs.push(linkComponentRef);
        aTag.replaceWith(linkComponentRef.location.nativeElement);
      }
    });
  }

  ngOnDestroy(): void {
    for (const linkComponentRef of this.linkComponentRefs) {
      this.dynamicComponentService.destroyComponent(linkComponentRef);
    }
  }
}
