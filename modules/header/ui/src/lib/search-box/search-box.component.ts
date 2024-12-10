import { SvgButtonRendererComponent } from '@angular-youtube/shared-ui';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'ay-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  imports: [SvgButtonRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--search-icon-legacy-bg-color]':
      'searchIconLegacyBackgroundColor()',
  },
})
export class SearchBoxComponent {
  searchIconLegacyBackgroundColor = signal('rgb(248, 248, 248)');
  onSearch(event: MouseEvent) {
    event.preventDefault();
  }

  mouseEnter(event: Event) {
    this.searchIconLegacyBackgroundColor.set('rgb(240, 240, 240)');
  }

  mouseLeave(event: Event) {
    this.searchIconLegacyBackgroundColor.set('rgb(248, 248, 248)');
  }
}
