import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'ay-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SearchBoxComponent {
  onSearch(event: MouseEvent) {
    event.preventDefault();
  }
}
