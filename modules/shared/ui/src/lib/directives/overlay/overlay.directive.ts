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
  standalone: true,
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
})
export class OverlayDirective {
  panelClass = input<string[]>([]);
  connectedOverlayOpen = model.required<boolean>();
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

    afterNextRender(() => {
      const element: Element | null = (<any>(
        this.cdkConnectedOverlay
      ))._getOriginElement();
      element?.addEventListener('click', () => {
        this.connectedOverlayOpen.update((v) => !v);
      });
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
}
