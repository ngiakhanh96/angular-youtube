import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { NgTemplateOutlet } from '@angular/common';
import {
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
  standalone: true,
  imports: [GoogleSigninButtonModule, NgTemplateOutlet],
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
