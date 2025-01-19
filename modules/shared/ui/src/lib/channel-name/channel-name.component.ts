import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IconDirective } from '../directives/icon/icon.directive';
import { TextRenderComponent } from '../text-renderer/text-renderer.component';
@Component({
  selector: 'ay-channel-name',
  templateUrl: './channel-name.component.html',
  styleUrls: ['./channel-name.component.scss'],
  imports: [TextRenderComponent, IconDirective, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelNameComponent {
  channelName = input.required<string>();
  isVerified = input.required<boolean>();
  fontWeight = input.required<string>();
}
