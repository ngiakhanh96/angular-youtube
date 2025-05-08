import {
  ISection,
  ISectionItem,
  MenuComponent,
  OverlayDirective,
  SvgButtonRendererComponent,
} from '@angular-youtube/shared-ui';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

@Component({
  selector: 'ay-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  imports: [
    SvgButtonRendererComponent,
    ReactiveFormsModule,
    OverlayDirective,
    OverlayModule,
    MenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--search-icon-legacy-bg-color]':
      'searchIconLegacyBackgroundColor()',
    '[style.--search-box-container-padding-left]':
      'searchBoxContainerPaddingLeft()',
  },
})
export class SearchBoxComponent implements OnInit {
  searchIconLegacyBackgroundColor = signal('rgb(248, 248, 248)');
  inputElement = viewChild.required<ElementRef>('input');
  isOpenedSuggestionDropdown = signal(false);
  searchBoxContainerPaddingLeftPx = signal(16);
  searchBoxContainerPaddingLeft = computed(
    () => `${this.searchBoxContainerPaddingLeftPx()}px`,
  );
  suggestionTexts = input<string[]>([]);
  suggestions = computed<ISection[]>(() => {
    const sectionItems: ISectionItem[] = this.suggestionTexts().map((v) => ({
      iconName: 'search',
      displayHtml: this.highlightSearchText(
        v,
        this.form.controls.searchQuery.value ?? '',
      ),
    }));
    return [{ sectionItems }];
  });
  selectedText = signal<string | null>(null);
  searchQueryChange = output<string>();
  selectedSuggestion = false;

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  form = this.formBuilder.group({
    searchQuery: new FormControl('', Validators.required),
  });

  constructor() {
    effect(() => {
      this.form.controls.searchQuery.patchValue(this.selectedText());
      this.selectedSuggestion = true;
      this.search();
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(
          (event: RouterEvent) =>
            event instanceof NavigationEnd ||
            (event as { routerEvent?: NavigationEnd }).routerEvent instanceof
              NavigationEnd,
        ),
        map((event: RouterEvent) =>
          event instanceof NavigationEnd
            ? event
            : (event as { routerEvent: NavigationEnd }).routerEvent,
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

    // Listen for search input changes with debounce
    this.form.controls.searchQuery.valueChanges
      .pipe(
        debounceTime(300), // 300ms debounce
        distinctUntilChanged(),
        map((value) => value?.trim() || ''),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        if (this.selectedSuggestion) {
          this.selectedSuggestion = false;
          return;
        }
        if (value.length > 0) {
          this.isOpenedSuggestionDropdown.set(true);
          this.searchQueryChange.emit(value);
        } else {
          this.isOpenedSuggestionDropdown.set(false);
        }
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.search();
  }

  search() {
    if (this.form.valid) {
      this.isOpenedSuggestionDropdown.set(false);
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

  onClear(event: Event) {
    event.preventDefault();
    this.form.reset();
    this.inputElement().nativeElement.focus();
  }

  private highlightSearchText(text: string, searchQuery?: string): string {
    if (!searchQuery) {
      return text;
    }
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + searchQuery.length);
    const after = text.slice(index + searchQuery.length);

    return `${before}<b>${match}</b>${after}`;
  }
}
