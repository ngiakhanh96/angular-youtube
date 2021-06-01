import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({ selector: '[ayTopbarMenuButtonTmp]' })
export class TopbarMenuButtonTemplateDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ay-topbar-menu-button-renderer',
  templateUrl: './topbar-menu-button-renderer.component.html',
  styleUrls: ['./topbar-menu-button-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarMenuButtonRendererComponent {
  @ContentChild(TopbarMenuButtonTemplateDirective, {
    read: TemplateRef,
    static: false,
  })
  public topbarMenuButtonTmp: TemplateRef<unknown> | null = null;

  @Input() public ariaLabel = '';
  @Input() public viewBox = '';
  @Input() public path = '';
}
