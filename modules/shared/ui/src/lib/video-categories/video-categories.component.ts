import { NgTemplateOutlet } from '@angular/common';
import {
  afterEveryRender,
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
import { TextIconButtonComponent } from '../text-icon-button/text-icon-button.component';

export interface IVideoCategory {
  title: string;
  id: string;
}

@Component({
  selector: 'ay-video-categories',
  imports: [MatChipsModule, TextIconButtonComponent, NgTemplateOutlet],
  templateUrl: './video-categories.component.html',
  styleUrls: ['./video-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCategoriesComponent {
  videoCategories = input.required<IVideoCategory[]>();
  shouldShowScrollLeftButton = signal(false);
  shouldShowScrollRightButton = signal(false);
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
        if (this.videoCategoryList) {
          this.videoCategoryList.addEventListener('scroll', () =>
            this.onListScroll(),
          );
        }
      },
    });
    afterEveryRender({
      read: () => {
        if (this.videoCategoryList) {
          this.onListScroll();
        }
      },
    });
  }

  onListScroll() {
    if (this.videoCategoryList) {
      this.shouldShowScrollLeftButton.set(
        this.videoCategoryList.scrollLeft > 0,
      );
      this.shouldShowScrollRightButton.set(
        this.videoCategoryList.scrollLeft <
          this.videoCategoryList.scrollWidth -
            this.videoCategoryList.clientWidth -
            2,
      );
    }
  }

  selectVideoCategory(videoCategory: IVideoCategory) {
    this.selectedVideoCategory.set(videoCategory);
  }

  onScrollLeft() {
    if (this.videoCategoryList) {
      this.videoCategoryList.scrollLeft -= this.scrollingWidth();
    }
  }

  onScrollRight() {
    if (this.videoCategoryList) {
      this.videoCategoryList.scrollLeft += this.scrollingWidth();
    }
  }
}
