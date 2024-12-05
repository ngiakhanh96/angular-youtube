import { CdkConnectedOverlay, Overlay } from '@angular/cdk/overlay';
import { Directive, inject, signal } from '@angular/core';

@Directive({
  selector: '[ayOverlay]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkConnectedOverlay,
      inputs: [
        'cdkConnectedOverlayOrigin: connectedOverlayOrigin',
        'cdkConnectedOverlayOpen: connectedOverlayOpen',
        'cdkConnectedOverlayPositions: connectedOverlayPositions',
        'cdkConnectedOverlayWidth: connectedOverlayWidth',
      ],
      outputs: ['overlayOutsideClick'],
    },
  ],
})
export class OverlayDirective {
  private cdkConnectedOverlay = inject(CdkConnectedOverlay);
  public scrollStrategy = signal(inject(Overlay).scrollStrategies.reposition());
  constructor() {
    this.cdkConnectedOverlay.panelClass = 'overlay-panel';
    this.cdkConnectedOverlay.disposeOnNavigation = true;
    this.cdkConnectedOverlay.flexibleDimensions = true;
    this.cdkConnectedOverlay.scrollStrategy = this.scrollStrategy();
  }
}
