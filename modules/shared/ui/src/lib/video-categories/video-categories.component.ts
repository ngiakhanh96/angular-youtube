import { NgTemplateOutlet } from '@angular/common';
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
      },
    });
  }

  selectVideoCategory(videoCategory: IVideoCategory) {
    this.selectedVideoCategory.set(videoCategory);
  }

  onScrollLeft() {
    if (this.videoCategoryList) {
      this.shouldShowScrollRightButton.set(true);
      this.videoCategoryList.scrollLeft -= this.scrollingWidth();
      setTimeout(() => {
        if (this.videoCategoryList!.scrollLeft <= 0) {
          this.shouldShowScrollLeftButton.set(false);
        }
      }, 500);
    }
  }

  onScrollRight() {
    if (this.videoCategoryList) {
      this.shouldShowScrollLeftButton.set(true);
      this.videoCategoryList.scrollLeft += this.scrollingWidth();
      setTimeout(() => {
        if (
          this.videoCategoryList!.scrollLeft >=
          this.videoCategoryList!.scrollWidth -
            this.videoCategoryList!.clientWidth -
            2
        ) {
          this.shouldShowScrollRightButton.set(false);
        }
      }, 500);
    }
  }
}
