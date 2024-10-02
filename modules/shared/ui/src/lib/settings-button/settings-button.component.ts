import { Component } from '@angular/core';
import { SvgButtonRendererComponent } from '../svg-button-renderer/svg-button-renderer.component';

@Component({
  selector: 'ay-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
  standalone: true,
  imports: [SvgButtonRendererComponent],
})
export class SettingsButtonComponent {}
