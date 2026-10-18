import {
  ImageDirective,
  TextIconButtonComponent,
} from '@angular-youtube/shared-ui';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'ay-comment-input',
  imports: [ImageDirective, TextIconButtonComponent],
  templateUrl: './comment-input.component.html',
  styleUrl: './comment-input.component.scss',
})
export class CommentInputComponent implements FormValueControl<string> {
  readonly value = model('');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly name = input('');
  readonly touch = output<void>();
  readonly inputId = input.required<string>();
  readonly avatarUrl = input('');
  readonly layout = input<'default' | 'reply'>('default');
  readonly placeholder = input('Add a comment...');
  readonly inputLabel = input('Add a comment');
  readonly submitLabel = input('Comment');
  readonly isSubmitting = input(false);
  readonly submitDisabled = input(false);
  readonly error = input('');
  readonly autoFocus = input(false);
  readonly submitted = output<string>();
  readonly cancelled = output<void>();
  protected readonly isFocused = signal(false);
  protected readonly avatarSize = computed(() =>
    this.layout() === 'reply' ? 24 : 40,
  );
  protected readonly errorId = computed(() => `${this.inputId()}-error`);
  protected readonly displayError = computed(
    () =>
      this.error() ||
      this.errors()
        .map((error) => error.message)
        .filter(Boolean)
        .join(' '),
  );
  protected readonly canSubmit = computed(
    () =>
      !this.isSubmitting() &&
      !this.submitDisabled() &&
      !this.disabled() &&
      !this.readonly() &&
      !this.invalid() &&
      !!this.value().trim(),
  );
  private readonly inputElement =
    viewChild<ElementRef<HTMLInputElement>>('inputElement');

  constructor() {
    afterNextRender(() => {
      if (this.autoFocus()) this.focus();
    });
  }

  reset() {
    this.isFocused.set(false);
  }

  focus(options?: FocusOptions) {
    this.inputElement()?.nativeElement.focus(options);
    this.isFocused.set(true);
  }

  protected cancel() {
    if (this.isSubmitting() || this.disabled()) return;
    this.reset();
    this.cancelled.emit();
  }

  protected submit() {
    if (!this.canSubmit()) return;
    this.submitted.emit(this.value().trim());
  }
}
