import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({ selector: '[ayTopbarMenuButtonTmp]', standalone: true })
export class TopbarMenuButtonTemplateDirective {

}

@Component({
  selector: 'ay-topbar-menu-button-renderer',
  templateUrl: './topbar-menu-button-renderer.component.html',
  styleUrls: ['./topbar-menu-button-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
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