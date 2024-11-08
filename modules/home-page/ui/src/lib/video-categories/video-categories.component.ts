import { SvgButtonRendererComponent } from '@angular-youtube/shared-ui';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'ay-video-categories',
  standalone: true,
  imports: [MatChipsModule, SvgButtonRendererComponent],
  templateUrl: './video-categories.component.html',
  styleUrls: ['./video-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCategoriesComponent {
  videoCategories = input.required<string[]>();
  shouldShowScrollLeftButton = signal(false);
  shouldShowScrollRightButton = signal(true);
  private videoCategoryList?: Element;
  constructor() {
    const hostNativeElement = inject(ElementRef).nativeElement as Element;
    afterNextRender({
      read: () => {
        this.videoCategoryList = hostNativeElement.getElementsByClassName(
          'mdc-evolution-chip-set__chips',
        )[0];
      },
    });
  }

  onScrollLeft() {
    if (this.videoCategoryList) {
      this.shouldShowScrollRightButton.set(true);
      const oldScrollLeftPosition = this.videoCategoryList.scrollLeft;
      this.videoCategoryList.scrollLeft -= 400;
      setTimeout(() => {
        if (this.videoCategoryList?.scrollLeft === oldScrollLeftPosition) {
          this.shouldShowScrollLeftButton.set(false);
        }
      }, 100);
    }
  }

  onScrollRight() {
    if (this.videoCategoryList) {
      this.shouldShowScrollLeftButton.set(true);
      const oldScrollLeftPosition = this.videoCategoryList.scrollLeft;
      this.videoCategoryList.scrollLeft += 400;
      setTimeout(() => {
        if (this.videoCategoryList?.scrollLeft === oldScrollLeftPosition) {
          this.shouldShowScrollRightButton.set(false);
        }
      }, 100);
    }
  }
}
