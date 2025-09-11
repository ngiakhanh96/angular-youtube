import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { ImageDirective } from '../directives/image/image.directive';
import { RippleOnHoverDirective } from '../directives/ripple-on-hover/ripple-on-hover.directive';

@Component({
  selector: 'ay-img',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  imports: [
    CommonModule,
    MatRippleModule,
    RippleOnHoverDirective,
    ImageDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {
  public rippleColor = input('rgb(0, 0, 0, 0.2)');
  public ariaLabel = input('');
  public viewBox = input<string | undefined>(undefined);
  public path = input('');
  public disabled = input<boolean>(false);
  public radius = input<number>(20);
  public opacity = input<number>(1);
  public fillRule = input<string>('nonZero');
  public fill = input('currentColor');
  public width = input.required<number>();
  public height = input.required<number>();
  public imgSrc = input<string | undefined>();
}
