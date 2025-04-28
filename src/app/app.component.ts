import { SpinnerComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule, SpinnerComponent],
  selector: 'ay-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular-youtube';

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent): void {
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  @HostListener('drag', ['$event'])
  onDrag(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent) {
    event.preventDefault();
  }
}
