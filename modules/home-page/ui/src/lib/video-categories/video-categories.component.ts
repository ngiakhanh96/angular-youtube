import { SvgButtonRendererComponent } from '@angular-youtube/shared-ui';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

export interface IVideoCategoryViewModel {
  title: string;
  id: string;
}

@Component({
  selector: 'ay-video-categories',
  standalone: true,
  imports: [MatChipsModule, SvgButtonRendererComponent],
  templateUrl: './video-categories.component.html',
  styleUrls: ['./video-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCategoriesComponent {
  videoCategories = input.required<IVideoCategoryViewModel[]>();
  shouldShowScrollLeftButton = signal(false);
  shouldShowScrollRightButton = signal(true);
  selectedVideoCategory = signal<IVideoCategoryViewModel | null>(null);
  private videoCategoryList?: Element;
  private static scrollingWidth = 400;
  constructor() {
    const hostNativeElement = inject(ElementRef).nativeElement as Element;
    afterNextRender({
      read: () => {
        this.videoCategoryList = hostNativeElement.getElementsByClassName(
          'mdc-evolution-chip-set__chips',
        )[0];
        (<any>this.videoCategoryList).onscrollend = (event: Event) =>
          this.onScrollEnd(event);
      },
    });

    //TODO change to linkedSignal in angular 19
    effect(
      () => {
        this.selectedVideoCategory.set(this.videoCategories()[0]);
      },
      { allowSignalWrites: true },
    );
  }

  selectVideoCategory(videoCategory: IVideoCategoryViewModel) {
    this.selectedVideoCategory.set(videoCategory);
  }

  onScrollEnd(event: Event) {
    if ((<Element>event.target).scrollLeft === 0) {
      this.shouldShowScrollLeftButton.set(false);
    } else if (
      this.videoCategoryList &&
      (<Element>event.target).scrollLeft ===
        this.videoCategoryList.scrollWidth - this.videoCategoryList.clientWidth
    ) {
      this.shouldShowScrollRightButton.set(false);
    }
  }

  onScrollLeft() {
    if (this.videoCategoryList) {
      this.shouldShowScrollRightButton.set(true);
      this.videoCategoryList.scrollLeft -=
        VideoCategoriesComponent.scrollingWidth;
    }
  }

  onScrollRight() {
    if (this.videoCategoryList) {
      this.shouldShowScrollLeftButton.set(true);
      this.videoCategoryList.scrollLeft +=
        VideoCategoriesComponent.scrollingWidth;
    }
  }
}
