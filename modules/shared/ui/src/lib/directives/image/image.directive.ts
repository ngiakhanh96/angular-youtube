import { NgOptimizedImage } from '@angular/common';
import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[ayImgSrc]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgOptimizedImage,
      inputs: ['ngSrc: ayImgSrc', 'width', 'height', 'priority'],
    },
  ],
})
export class ImageDirective {
  ngOptimizedImage = inject(NgOptimizedImage);
  image: HTMLImageElement = inject(ElementRef).nativeElement;

  constructor() {
    this.image.referrerPolicy = 'no-referrer';
  }
}
