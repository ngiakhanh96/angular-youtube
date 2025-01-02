import {
  afterNextRender,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  inject,
  Injector,
  input,
  Renderer2,
  viewChild,
} from '@angular/core';
import { LinkComponent } from '../link/link.component';

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
export class CardComponent {
  backgroundColor = input('rgba(0, 0, 0, 0.05)');
  padding = input('12px');
  cardContainer = viewChild.required<ElementRef<HTMLElement>>('cardContainer');
  renderer2 = inject(Renderer2);
  injector = inject(Injector);
  appRef = inject(ApplicationRef);
  componentFactoryResolver = inject(ComponentFactoryResolver);
  linkComponentFactory =
    this.componentFactoryResolver.resolveComponentFactory(LinkComponent);
  static supportedSocialMedias = new Set([
    'www.twitch.com',
    'www.facebook.com',
    'www.twitter.com',
    'www.tiktok.com',
  ]);
  constructor() {
    afterNextRender(() => {
      const cardContainerElement = this.cardContainer().nativeElement;
      const aTags = Array.from(cardContainerElement.getElementsByTagName('a'));
      for (const aTag of aTags) {
        const href = aTag.getAttribute('href') ?? '';
        if (href.startsWith('https')) {
          aTag.textContent = 'https://' + aTag.textContent;
        } else if (href.startsWith('http')) {
          aTag.textContent = 'http://' + aTag.textContent;
        }
        const fullHrefUrl = new URL(aTag.href);

        if (CardComponent.supportedSocialMedias.has(fullHrefUrl.host)) {
          const linkComponentRef = this.linkComponentFactory.create(
            this.injector,
          );
          linkComponentRef.setInput('href', 'https://www.twitter.com');
          this.appRef.attachView(linkComponentRef.hostView);
          linkComponentRef.instance.cdr.detectChanges();
          aTag.replaceChildren(linkComponentRef.location.nativeElement);
        }
      }
    });
  }
}
