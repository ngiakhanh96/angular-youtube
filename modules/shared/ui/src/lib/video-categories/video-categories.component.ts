import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { SvgButtonRendererComponent } from '../svg-button-renderer/svg-button-renderer.component';

export interface IVideoCategory {
  title: string;
  id: string;
}

@Component({
  selector: 'ay-video-categories',
  imports: [MatChipsModule, SvgButtonRendererComponent],
  templateUrl: './video-categories.component.html',
  styleUrls: ['./video-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCategoriesComponent {
  videoCategories = input.required<IVideoCategory[]>();
  shouldShowScrollLeftButton = signal(false);
  shouldShowScrollRightButton = signal(true);
  scrollingWidth = input.required<number>();
  selectedVideoCategory = linkedSignal(() => this.videoCategories()[0]);
  private videoCategoryList?: Element;
  constructor() {
    const hostNativeElement =
      inject<ElementRef<Element>>(ElementRef).nativeElement;
    afterNextRender({
      read: () => {
        this.videoCategoryList = hostNativeElement.getElementsByClassName(
          'mdc-evolution-chip-set__chips',
        )[0];
        if (this.videoCategoryList instanceof HTMLElement) {
          this.videoCategoryList.onscrollend = (event: Event) =>
            this.onScrollEnd(event);
        }
      },
    });
  }

  selectVideoCategory(videoCategory: IVideoCategory) {
    this.selectedVideoCategory.set(videoCategory);
  }

  onScrollEnd(event: Event) {
    if (event.target instanceof Element && event.target.scrollLeft === 0) {
      this.shouldShowScrollLeftButton.set(false);
    } else if (
      this.videoCategoryList &&
      event.target instanceof Element &&
      event.target.scrollLeft ===
        this.videoCategoryList.scrollWidth - this.videoCategoryList.clientWidth
    ) {
      this.shouldShowScrollRightButton.set(false);
    }
  }

  onScrollLeft() {
    if (this.videoCategoryList) {
      this.shouldShowScrollRightButton.set(true);
      this.videoCategoryList.scrollLeft -= this.scrollingWidth();
    }
  }

  onScrollRight() {
    if (this.videoCategoryList) {
      this.shouldShowScrollLeftButton.set(true);
      this.videoCategoryList.scrollLeft += this.scrollingWidth();
    }
  }
}
