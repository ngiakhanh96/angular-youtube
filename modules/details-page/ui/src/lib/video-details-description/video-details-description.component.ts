import { CardComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ay-video-details-description',
  templateUrl: './video-details-description.component.html',
  styleUrls: ['./video-details-description.component.scss'],
  imports: [CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDetailsDescriptionComponent {
  descriptionHtml = input<string>();
  sanitizer = inject(DomSanitizer);
  sanitizedDescriptionHtml = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.descriptionHtml() ?? ''),
  );
}
