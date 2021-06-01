import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({ selector: '[ayButtonTextTmp]' })
export class ButtonTextTemplateDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

@Directive({ selector: '[ayButtonIconTmp]' })
export class ButtonIconTemplateDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ay-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonRendererComponent {
  @ContentChild(ButtonTextTemplateDirective, {
    read: TemplateRef,
    static: false,
  })
  public buttonTextTmp: TemplateRef<unknown> | null = null;

  @ContentChild(ButtonIconTemplateDirective, {
    read: TemplateRef,
    static: false,
  })
  public buttonIconTmp: TemplateRef<unknown> | null = null;

  @Input() public href = '#';
  @Input() public color = 'rgb(6, 95, 212)';
}
