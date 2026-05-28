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
  OnDestroy,
  Renderer2,
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
export class VideoCategoriesComponent implements OnDestroy {
  videoCategories = input.required<IVideoCategory[]>();
  shouldShowScrollLeftButton = signal(false);
  shouldShowScrollRightButton = signal(false);
  scrollingWidth = input.required<number>();
  selectedVideoCategory = linkedSignal(() => this.videoCategories()[0]);
  private videoCategoryList?: HTMLElement;
  private renderer = inject(Renderer2);
  private scrollUnlisten: (() => void) | null = null;

  constructor() {
    const hostNativeElement =
      inject<ElementRef<Element>>(ElementRef).nativeElement;
    afterNextRender({
      read: () => {
        this.videoCategoryList = hostNativeElement.getElementsByClassName(
          'mdc-evolution-chip-set__chips',
        )[0] as HTMLElement | undefined;
        if (this.videoCategoryList) {
          // Use Renderer2.listen so we get an unlisten function we can call on destroy
          this.scrollUnlisten = this.renderer.listen(
            this.videoCategoryList,
            'scroll',
            () => this.onListScroll(),
          );
        }
      },
    });
    //For initial state
    afterEveryRender({
      read: () => {
        if (this.videoCategoryList) {
          this.onListScroll();
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.scrollUnlisten?.();
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
