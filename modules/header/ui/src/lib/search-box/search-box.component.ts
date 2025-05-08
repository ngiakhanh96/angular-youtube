import {
  ISection,
  ISectionItem,
  MenuComponent,
  OverlayDirective,
  SvgButtonRendererComponent,
} from '@angular-youtube/shared-ui';
import { OverlayModule } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
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
  shouldOpenSuggestionDropdown = signal(false);
  searchBoxContainerPaddingLeftPx = signal(16);
  searchBoxContainerPaddingLeft = computed(
    () => `${this.searchBoxContainerPaddingLeftPx()}px`,
  );
  suggestionTexts = input<string[]>([]);
  suggestions = linkedSignal<ISection[]>(() => {
    const sectionItems: ISectionItem[] = this.suggestionTexts().map((v) => ({
      iconName: 'search',
      displayHtml: this.highlightSearchText(
        v,
        this.form.controls.searchQuery.value ?? '',
      ),
    }));
    return [{ sectionItems }];
  });
  isOpenedSuggestionDropdown = linkedSignal(() => {
    const shouldOpenSuggestionDropdown = this.shouldOpenSuggestionDropdown();
    const hasSuggestion = this.suggestions()[0]?.sectionItems.length > 0;
    return shouldOpenSuggestionDropdown && hasSuggestion;
  });
  selectedText = signal<string | null>(null);
  searchQueryChange = output<string>();
  selectedSuggestion = false;

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);

  form = this.formBuilder.group({
    searchQuery: new FormControl('', Validators.required),
  });

  constructor() {
    const tmp = this.document.createElement('DIV');
    effect(() => {
      tmp.innerHTML = this.selectedText() ?? '';
      this.form.controls.searchQuery.patchValue(tmp.textContent);
      this.selectedSuggestion = true;
      this.search();
    });

    afterNextRender({
      read: () => {
        this.router.events
          .pipe(
            filter(
              (event: RouterEvent) =>
                event instanceof NavigationEnd ||
                (event as { routerEvent?: NavigationEnd })
                  .routerEvent instanceof NavigationEnd,
            ),
            map((event: RouterEvent) =>
              event instanceof NavigationEnd
                ? event
                : (event as { routerEvent: NavigationEnd }).routerEvent,
            ),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe((event: NavigationEnd) => {
            const url = new URL(event.url, this.document.baseURI);
            if (url.pathname.includes('results')) {
              this.form.controls.searchQuery.setValue(
                url.searchParams.get('search_query'),
              );
            }
          });
      },
    });
  }

  ngOnInit(): void {
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
          this.searchQueryChange.emit(value);
          this.suggestions.set([]);
          this.shouldOpenSuggestionDropdown.set(true);
        } else {
          this.shouldOpenSuggestionDropdown.set(false);
        }
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.search();
  }

  search() {
    if (this.form.valid) {
      this.shouldOpenSuggestionDropdown.set(false);
      this.router.navigate(['results'], {
        queryParams: {
          search_query: this.form.value.searchQuery,
        },
      });
    }
  }

  onMouseEnter() {
    this.searchIconLegacyBackgroundColor.set('rgb(240, 240, 240)');
  }

  onMouseLeave() {
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
