import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChild,
  inject,
  input,
} from '@angular/core';

@Directive({ selector: '[ayButtonTextTmp]', standalone: true })
export class ButtonTextTemplateDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Directive({ selector: '[ayButtonIconTmp]', standalone: true })
export class ButtonIconTemplateDirective {
  template = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
    selector: 'ay-button-renderer',
    templateUrl: './button-renderer.component.html',
    styleUrls: ['./button-renderer.component.scss'],
    imports: [NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonRendererComponent {
  public buttonTextTmp = contentChild(ButtonTextTemplateDirective, {
    read: TemplateRef,
  });
  public buttonIconTmp = contentChild(ButtonIconTemplateDirective, {
    read: TemplateRef,
  });

  public href = input('#');
  public color = input('rgb(6, 95, 212)');
}
