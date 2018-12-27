import {
  Component, ContentChild,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
  SimpleChanges, TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';

/**
 * Keyboard events
 */
const isArrowUp = keyCode => keyCode === 38;
const isArrowDown = keyCode => keyCode === 40;
const isArrowUpDown = keyCode => isArrowUp(keyCode) || isArrowDown(keyCode);
const isEnter = keyCode => keyCode === 13;
const isBackspace = keyCode => keyCode === 8;
const isDelete = keyCode => keyCode === 46;
const isESC = keyCode => keyCode === 27;
const isTab = keyCode => keyCode === 9;


@Component({
  selector: 'ng-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'handleClick($event)',
  },
})


// TODO: responsive design
// TODO: infinite and virtual scroll
// TODO: styles, class
// TODO: material style ui
// TODO: tests

export class AutocompleteComponent implements OnInit, OnChanges {
  @ViewChild('searchInput') searchInput: ElementRef; // input element

  inputKeyUp$: Observable<any>; // input events
  inputKeyDown$: Observable<any>; // input events

  public query = ''; // search query
  public filteredList = []; // list of items
  public historyList = []; // list of history items
  public isHistoryListVisible = true;
  public elementRef;
  public selectedIdx: number;
  public toHighlight: string = '';
  public notFound = false;
  public isFocused: Boolean;
  public isOpen: Boolean;

  // inputs
  /**
   * Data of items list.
   * It can be array of strings or array of objects.
   */
  @Input() public data = [];
  @Input() public searchKeyword: string; // keyword to filter the list
  @Input() public placeHolder = ''; // input placeholder
  /**
   * History identifier of history list
   * When valid history identifier is given, then component stores selected item to local storage of user's browser.
   * If it is null then history is hidden.
   * History list is visible if at least one history item is stored.
   */
  @Input() public historyIdentifier: String;
  /**
   * Heading text of history list.
   * If it is null then history heading is hidden.
   */
  @Input() public historyHeading = 'Recently selected';
  @Input() public historyListMaxNumber = 15; // maximum number of items in the history list.
  @Input() public notFoundText = 'Not found'; // set custom text when filter returns empty result
  @Input() public isLoading: Boolean; // loading mask
  @Input() public debounceTime: 400; // delay time while typing
  @Input() public initialValue: any; // set initial value


  // output events
  /** Event that is emitted whenever an item from the list is selected. */
  @Output() selected = new EventEmitter();

  /** Event that is emitted whenever an input is changed. */
  @Output() inputChanged = new EventEmitter();

  /** Event that is emitted whenever an input is focused. */
  @Output() readonly inputFocused: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is opened. */
  @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();


  // custom templates
  @ContentChild(TemplateRef)
  @Input() itemTemplate: TemplateRef<any>;
  @Input() notFoundTemplate: TemplateRef<any>;

  constructor(myElemenetRef: ElementRef) {
    this.elementRef = myElemenetRef;
    this.selectedIdx = -1;
  }

  ngOnInit() {
    this.initEventStream();
    this.setInitialValue(this.initialValue);
  }

  /**
   * Set initial value
   * @param value
   */
  public setInitialValue(value: any) {
    if (this.initialValue) {
      this.select(value);
    }
  }

  /**
   * Update search results
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes.data &&
      Array.isArray(changes.data.currentValue)
    ) {
      if (!changes.data.firstChange && this.isFocused) {
        this.open();
      }
    }
  }

  /**
   * Filter data
   */
  public filterList() {
    this.initSearchHistory();
    if (this.query != null && this.data) {
      this.toHighlight = this.query;
      this.filteredList = this.data.filter((item: any) => {
        if (typeof item === 'string') {
          // string logic, check equality of strings
          return item.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        } else if (typeof item === 'object' && item.constructor === Object) {
          // object logic, check property equality
          return item[this.searchKeyword].toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        }
      });
    } else {
      this.notFound = false;
    }
  }


  /**
   * Check type of item in the list.
   * @param item
   */
  isType(item) {
    return typeof item === 'string';
  }

  /**
   * Select item in the list.
   * @param item
   */
  public select(item) {
    this.query = !this.isType(item) ? item[this.searchKeyword] : item;
    this.selected.emit(item);

    if (this.initialValue) {
      // check if history already exists in localStorage and then update
      const history = window.localStorage.getItem(`${this.historyIdentifier}`);
      if (history) {
        let existingHistory = JSON.parse(localStorage[`${this.historyIdentifier}`]);
        if (!(existingHistory instanceof Array)) existingHistory = [];

        // check if selected item exists in existingHistory
        if (!existingHistory.some((existingItem) => !this.isType(existingItem)
          ? existingItem[this.searchKeyword] == item[this.searchKeyword] : existingItem == item)) {
          existingHistory.unshift(item);
          localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(existingHistory));

          // check if items don't exceed max allowed number
          if (existingHistory.length >= this.historyListMaxNumber) {
            existingHistory.splice(existingHistory.length - 1, 1);
            localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(existingHistory));
          }
        }
      } else {
        this.saveHistory(item);
      }
    } else {
      this.saveHistory(item);
    }
    this.close();
  }

  /**
   * Document click
   * @param e event
   */
  public handleClick(e) {
    let clickedComponent = e.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
        if (this.filteredList.length) {
          this.open();
        }
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.close();
    }
  }

  /**
   * Remove search query
   */
  public remove() {
    this.query = '';
    this.close();
  }

  /**
   * Initialize historyList search
   */
  initSearchHistory() {
    this.isHistoryListVisible = false;
    if (this.historyIdentifier && !this.query) {
      const history = window.localStorage.getItem(`${this.historyIdentifier}`);
      if (history) {
        this.isHistoryListVisible = true;
        this.filteredList = [];
        this.historyList = history ? JSON.parse(history) : [];
      } else {
        this.isHistoryListVisible = false;
      }
    } else {
      this.isHistoryListVisible = false;
    }
  }

  open() {
    if (this.isOpen || this.isOpen && !this.isLoading) {
      return;
    }
    this.filterList();
    this.opened.emit();
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) {
      return;
    }
    this.filteredList = [];
    this.selectedIdx = -1;
    this.notFound = false;
    this.isHistoryListVisible = false;
    this.isFocused = false;
    this.closed.emit();
    this.isOpen = false;
  }

  focus(e) {
    //this.searchInput.nativeElement.focus();
    if (this.isFocused) {
      return;
    }
    // if data exists then open
    if (this.data && this.data.length) {
      this.open();
    }
    this.inputFocused.emit(e);
    this.isFocused = true;
  }

  /**
   * Initialize keyboard events
   */
  initEventStream() {
    this.inputKeyUp$ = fromEvent(
      this.searchInput.nativeElement, 'keyup'
    ).pipe(map(
      (e: any) => e
    ));

    this.inputKeyDown$ = fromEvent(
      this.searchInput.nativeElement,
      'keydown'
    ).pipe(map(
      (e: any) => e
    ));

    this.listenEventStream();
  }

  /**
   * Listen keyboard events
   */
  listenEventStream() {
    // key up event
    this.inputKeyUp$
      .pipe(
        filter(e =>
          !isArrowUpDown(e.keyCode) &&
          !isEnter(e.keyCode) &&
          !isESC(e.keyCode) &&
          !isTab(e.keyCode)),
        debounceTime(this.debounceTime)
      ).subscribe(e => {
      this.onKeyUp(e);
    });

    // cursor up & down
    this.inputKeyDown$.pipe(filter(
      e => isArrowUpDown(e.keyCode)
    )).subscribe(e => {
      e.preventDefault();
      this.onFocusNextItem(e);
    });

    // enter
    this.inputKeyUp$.pipe(filter(e => isEnter(e.keyCode))).subscribe(e => {
      this.onHandleEnter();
    });

    // ESC
    this.inputKeyUp$.pipe(
      filter(e => isESC(e.keyCode),
        debounceTime(100))
    ).subscribe(e => {
      this.onEsc();
    });

    // delete
    this.inputKeyDown$.pipe(
      filter(e => isBackspace(e.keyCode) || isDelete(e.keyCode))
    ).subscribe(e => {
      this.onDelete();
    });
  }

  /**
   * on keyup == when input changed
   * @param e event
   */
  onKeyUp(e) {
    this.notFound = false; // search results are unknown while typing
    if (!this.query) {
      this.notFound = false;
    }
    this.inputChanged.emit(e.target.value);
    this.filterList();

    // If no results found
    if (!this.filteredList.length) {
      this.notFoundText ? this.notFound = true : this.notFound = false;
    }
  }

  /**
   * Keyboard arrow top and arrow bottom input
   * @param e event
   */
  onFocusNextItem(e) {
    // move arrow up and down on filteredList or historyList
    if (!this.historyList.length || !this.isHistoryListVisible) {
      // filteredList
      if (e.code === 'ArrowDown' && this.selectedIdx < this.filteredList.length - 1) {
        this.selectedIdx++;
      } else if (e.code === 'ArrowUp' && this.selectedIdx > 0) {
        this.selectedIdx--;
      }
    } else {
      // historyList
      if (e.code === 'ArrowDown' && this.selectedIdx < this.historyList.length - 1) {
        this.selectedIdx++;
      } else if (e.code === 'ArrowUp' && this.selectedIdx > 0) {
        this.selectedIdx--;
      }
    }
  }

  /**
   * Select item on enter click
   */
  onHandleEnter() {
    // click enter to choose item from filteredList or historyList
    if (this.selectedIdx > -1) {
      if (!this.historyList.length || !this.isHistoryListVisible) {
        // filteredList
        this.query = !this.isType(this.filteredList[this.selectedIdx])
          ? this.filteredList[this.selectedIdx][this.searchKeyword]
          : this.filteredList[this.selectedIdx];

        this.saveHistory(this.filteredList[this.selectedIdx]);
      } else {
        // historyList
        this.query = !this.isType(this.historyList[this.selectedIdx])
          ? this.historyList[this.selectedIdx][this.searchKeyword]
          : this.historyList[this.selectedIdx];

        this.saveHistory(this.historyList[this.selectedIdx]);
      }
    }
    this.isHistoryListVisible = false;
    this.close();
  }

  /**
   * Esc click
   */
  onEsc() {
    this.searchInput.nativeElement.blur();
    this.close();
  }

  /**
   * Delete click
   */
  onDelete() {
    //console.log('delete');
  }


  /**
   * Select item to save in localStorage
   * @param selected
   */
  saveHistory(selected) {
    if (this.historyIdentifier) {
      // check if selected item exists in historyList
      if (!this.historyList.some((item) => !this.isType(item)
        ? item[this.searchKeyword] == selected[this.searchKeyword] : item == selected)) {
        this.saveHistoryToLocalStorage([selected, ...this.historyList]);

        // check if items don't exceed max allowed number
        if (this.historyList.length >= this.historyListMaxNumber) {
          this.historyList.splice(this.historyList.length - 1, 1);
          this.saveHistoryToLocalStorage([selected, ...this.historyList]);
        }
      }
    }
  }

  /**
   * Save item in localStorage
   * @param selected
   */
  saveHistoryToLocalStorage(selected) {
    window.localStorage.setItem(
      `${this.historyIdentifier}`,
      JSON.stringify(selected)
    );
  }

  /**
   * Reset localStorage
   * @param e event
   */
  resetHistoryList(e) {
    e.stopPropagation();
    this.historyList = [];
    window.localStorage.removeItem(`${this.historyIdentifier}`);
    this.filterList();
  }

  /**
   * Remove item from localStorage
   * @param index
   * @param e event
   */
  removeHistoryItem(index, e) {
    e.stopPropagation();
    this.historyList = this.historyList.filter((v, i) => i !== index);
    this.saveHistoryToLocalStorage(this.historyList);
    if (this.historyList.length == 0) {
      window.localStorage.removeItem(`${this.historyIdentifier}`);
      this.open();
    }
  }
}

@Pipe({name: 'highlight'})
export class HighlightPipe implements PipeTransform {
  transform(text: string, search): string {
    let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    pattern = pattern.split(' ').filter((t) => {
      return t.length > 0;
    }).join('|');
    const regex = new RegExp(pattern, 'gi');

    return search ? text.replace(regex, (match) => `<b>${match}</b>`) : text;
  }
}
