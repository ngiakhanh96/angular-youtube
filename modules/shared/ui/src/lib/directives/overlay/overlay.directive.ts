import { CdkConnectedOverlay, Overlay } from '@angular/cdk/overlay';
import { Directive, effect, inject, input, signal } from '@angular/core';

@Directive({
  selector: '[ayOverlay]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkConnectedOverlay,
      inputs: [
        'cdkConnectedOverlayOrigin: connectedOverlayOrigin',
        'cdkConnectedOverlayOpen: connectedOverlayOpen',
        'cdkConnectedOverlayWidth: connectedOverlayWidth',
      ],
      outputs: ['overlayOutsideClick'],
    },
  ],
})
export class OverlayDirective {
  panelClass = input<string[]>([]);
  private cdkConnectedOverlay = inject(CdkConnectedOverlay);
  private scrollStrategy = signal(
    inject(Overlay).scrollStrategies.reposition(),
  );

  constructor() {
    effect(() => {
      this.cdkConnectedOverlay.panelClass = [
        'overlay-panel',
        ...this.panelClass(),
      ];
    });

    this.cdkConnectedOverlay.disposeOnNavigation = true;
    this.cdkConnectedOverlay.flexibleDimensions = true;
    this.cdkConnectedOverlay.scrollStrategy = this.scrollStrategy();
    this.cdkConnectedOverlay.positions = [
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
    ];
  }
}
