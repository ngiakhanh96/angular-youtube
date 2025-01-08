import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { DynamicComponentService } from '../services/dynamic-component.service';

@Component({
  selector: 'ay-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatRippleModule],
  host: {
    '[style.--background-color]': 'clickedBackgroundColor()',
    '[style.--padding]': 'padding()',
  },
})
export class CardComponent implements OnDestroy {
  backgroundColor = input('rgba(0, 0, 0, 0.05)');
  padding = input('12px');
  currentVideoId = input<string | undefined>();
  cardContainer = viewChild.required<ElementRef<HTMLElement>>('cardContainer');
  linkComponentRefs: ComponentRef<unknown>[] = [];
  dynamicComponentService = inject(DynamicComponentService);
  expand = output<boolean>();
  expanded = linkedSignal(() => {
    const expanded = !this.currentVideoId();
    this.expand.emit(expanded);
    return expanded;
  });

  isPressed = signal(false);

  clickedBackgroundColor = computed(() =>
    this.isPressed() ? 'rgba(0, 0, 0, 0.2)' : this.backgroundColor(),
  );

  constructor() {
    afterRenderEffect({
      write: async () => {
        const cardContainerElement = this.cardContainer().nativeElement;
        const currentVideoId = this.currentVideoId();
        const aTags = Array.from(
          cardContainerElement.getElementsByTagName('a'),
        );
        for (const aTag of aTags) {
          const linkComponentRef =
            await this.dynamicComponentService.createComponentLazily(
              () => import('../link/link.component'),
              'LinkComponent',
              {
                href: aTag.href,
                attributeHref: aTag.getAttribute('href') ?? '',
                text: aTag.textContent,
                currentVideoId: currentVideoId,
              },
            );
          this.linkComponentRefs.push(linkComponentRef);
          aTag.replaceWith(linkComponentRef.location.nativeElement);
        }
      },
    });
  }

  toggleExpanded() {
    this.expanded.update((v) => !v);
    this.expand.emit(this.expanded());
  }

  onClickCardShowButton(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // Store current scroll position
    const scrollPosition = window.scrollY;

    this.toggleExpanded();

    // Restore scroll position after DOM update
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant',
      });
    });
  }

  onClickCardContainer(event: Event) {
    if (!this.expanded()) {
      this.onClickCardShowButton(event);
    }
  }

  onMouseDown(event: Event) {
    if (
      event.target instanceof HTMLElement &&
      event.target.tagName.toLowerCase() !== 'a'
    ) {
      this.isPressed.set(true);
    }
  }

  onMouseUp(event: Event) {
    this.isPressed.set(false);
  }

  ngOnDestroy(): void {
    for (const linkComponentRef of this.linkComponentRefs) {
      this.dynamicComponentService.destroyComponent(linkComponentRef);
    }
  }
}
