import { SvgButtonRendererComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ay-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  imports: [SvgButtonRendererComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--search-icon-legacy-bg-color]':
      'searchIconLegacyBackgroundColor()',
  },
})
export class SearchBoxComponent {
  searchIconLegacyBackgroundColor = signal('rgb(248, 248, 248)');
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  form = this.formBuilder.group({
    searchQuery: new FormControl(''),
  });

  onSearch(event: MouseEvent) {
    event.preventDefault();
  }

  mouseEnter(event: Event) {
    this.searchIconLegacyBackgroundColor.set('rgb(240, 240, 240)');
  }

  mouseLeave(event: Event) {
    this.searchIconLegacyBackgroundColor.set('rgb(248, 248, 248)');
  }

  onClickSearch() {
    if (
      this.form.value.searchQuery &&
      this.form.value.searchQuery.trim() != ''
    ) {
      this.router.navigate(['results'], {
        queryParams: {
          search_query: this.form.value.searchQuery,
        },
      });
    }
  }
}
