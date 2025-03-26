import { SvgButtonRendererComponent } from '@angular-youtube/shared-ui';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

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
export class SearchBoxComponent implements OnInit {
  searchIconLegacyBackgroundColor = signal('rgb(248, 248, 248)');
  inputElement = viewChild.required<ElementRef>('input');
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  form = this.formBuilder.group({
    searchQuery: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd ||
            (<any>event).routerEvent instanceof NavigationEnd,
        ),
        map((event) =>
          event instanceof NavigationEnd ? event : (<any>event).routerEvent,
        ),
      )
      .subscribe((event: NavigationEnd) => {
        const baseUrl = window.location.origin;
        const url = new URL(event.url, baseUrl);
        if (!url.pathname.includes('results')) {
          this.form.reset();
        } else {
          this.form.controls.searchQuery.setValue(
            url.searchParams.get('search_query'),
          );
        }
      });
  }

  onSearch(event: MouseEvent) {
    event.preventDefault();
    if (this.form.valid) {
      this.router.navigate(['results'], {
        queryParams: {
          search_query: this.form.value.searchQuery,
        },
      });
    }
  }

  mouseEnter() {
    this.searchIconLegacyBackgroundColor.set('rgb(240, 240, 240)');
  }

  mouseLeave() {
    this.searchIconLegacyBackgroundColor.set('rgb(248, 248, 248)');
  }

  onClear(event: MouseEvent) {
    event.preventDefault();
    this.form.reset();
    this.inputElement().nativeElement.focus();
  }
}
