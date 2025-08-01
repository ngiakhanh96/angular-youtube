import { CdkConnectedOverlay, Overlay } from '@angular/cdk/overlay';
import {
  afterNextRender,
  Directive,
  effect,
  inject,
  input,
  model,
  signal,
  SimpleChange,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[ayOverlay]',
  hostDirectives: [
    {
      directive: CdkConnectedOverlay,
      inputs: [
        'cdkConnectedOverlayOrigin: connectedOverlayOrigin',
        'cdkConnectedOverlayWidth: connectedOverlayWidth',
        'cdkConnectedOverlayOffsetX: connectedOverlayOffsetX',
        'cdkConnectedOverlayOffsetY: connectedOverlayOffsetY',
      ],
      outputs: ['overlayOutsideClick'],
    },
  ],
  host: {
    '(window:resize)': 'resize()',
  },
})
export class OverlayDirective {
  panelClass = input<string[]>([]);
  connectedOverlayBoundedWidthElement = input<HTMLElement>();
  connectedOverlayOpen = model(false);
  autoOpenOnClick = input(true);
  private cdkConnectedOverlay = inject(CdkConnectedOverlay);
  private scrollStrategy = signal(
    inject(Overlay).scrollStrategies.reposition(),
  );

  constructor() {
    this.cdkConnectedOverlay.disposeOnNavigation = true;
    this.cdkConnectedOverlay.flexibleDimensions = true;
    this.cdkConnectedOverlay.scrollStrategy = this.scrollStrategy();
    this.cdkConnectedOverlay.positions = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'top',
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
      },
    ];

    this.cdkConnectedOverlay.overlayOutsideClick
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.connectedOverlayOpen.set(false));

    afterNextRender({
      read: () => {
        if (this.autoOpenOnClick()) {
          const element: Element | null = (<any>(
            this.cdkConnectedOverlay
          ))._getOriginElement();
          element?.addEventListener('click', () => {
            this.connectedOverlayOpen.update((v) => !v);
          });
        }
        this.resize();
      },
    });

    effect(() => {
      this.cdkConnectedOverlay.panelClass = [
        'overlay-panel',
        ...this.panelClass(),
      ];
    });

    effect(() => {
      const previousOpenValue = this.cdkConnectedOverlay.open;
      this.cdkConnectedOverlay.open = this.connectedOverlayOpen();
      this.cdkConnectedOverlay.ngOnChanges({
        open: new SimpleChange(
          previousOpenValue,
          this.connectedOverlayOpen(),
          false,
        ),
      });
    });
  }

  resize() {
    const connectedOverlayBoundedElementWidth =
      this.connectedOverlayBoundedWidthElement();
    if (connectedOverlayBoundedElementWidth) {
      const previousWidthValue = this.cdkConnectedOverlay.width;
      this.cdkConnectedOverlay.width =
        connectedOverlayBoundedElementWidth.offsetWidth;
      this.cdkConnectedOverlay.ngOnChanges({
        width: new SimpleChange(
          previousWidthValue,
          connectedOverlayBoundedElementWidth.offsetWidth,
          false,
        ),
      });
    }
  }
}
