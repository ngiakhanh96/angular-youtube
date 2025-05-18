import { SpinnerComponent } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule, SpinnerComponent],
  selector: 'ay-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(dragover)': 'onDragOver($event)',
    '(dragenter)': 'onDragEnter($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drag)': 'onDrag($event)',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
  },
})
export class AppComponent {
  title = 'angular-youtube';

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  onDrag(event: DragEvent) {
    event.preventDefault();
  }

  onDragStart(event: DragEvent) {
    event.preventDefault();
  }

  onDragEnd(event: DragEvent) {
    event.preventDefault();
  }
}
