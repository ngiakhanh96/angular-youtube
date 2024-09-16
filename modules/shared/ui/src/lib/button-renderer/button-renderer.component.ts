import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({ selector: '[ayButtonTextTmp]', standalone: true })
export class ButtonTextTemplateDirective {  template = inject<TemplateRef<unknown>>(TemplateRef);

}

@Directive({ selector: '[ayButtonIconTmp]', standalone: true })
export class ButtonIconTemplateDirective {  template = inject<TemplateRef<unknown>>(TemplateRef);

}

@Component({
  selector: 'ay-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss'],
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonRendererComponent {
  @ContentChild(ButtonTextTemplateDirective, {
    read: TemplateRef
  })
  public buttonTextTmp: TemplateRef<unknown> | null = null;

  @ContentChild(ButtonIconTemplateDirective, {
    read: TemplateRef
  })
  public buttonIconTmp: TemplateRef<unknown> | null = null;

  @Input() public href = '#';
  @Input() public color = 'rgb(6, 95, 212)';
}
