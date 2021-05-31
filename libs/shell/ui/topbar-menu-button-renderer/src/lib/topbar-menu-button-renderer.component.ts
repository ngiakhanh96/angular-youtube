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

  @Input()
  public set ariaLabel(v: string) {
    this._ariaLabel = v;
  }

  public get ariaLabel(): string {
    return this._ariaLabel;
  }

  private _ariaLabel = '';

  @Input()
  public set viewBox(v: string) {
    this._viewBox = v;
  }

  public get viewBox(): string {
    return this._viewBox;
  }

  private _viewBox = '';

  @Input()
  public set path(v: string) {
    this._path = v;
  }

  public get path(): string {
    return this._path;
  }

  private _path = '';
}
