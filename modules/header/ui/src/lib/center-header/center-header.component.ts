import { TextIconButtonComponent } from '@angular-youtube/shared-ui';
import {
  Component,
  input,
  output,
} from '@angular/core';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'ay-center-header',
  templateUrl: './center-header.component.html',
  styleUrls: ['./center-header.component.scss'],
  imports: [SearchBoxComponent, TextIconButtonComponent],
})
export class CenterHeaderComponent {
  searchSuggestions = input.required<string[]>();
  searchQueryChange = output<string>();
}
