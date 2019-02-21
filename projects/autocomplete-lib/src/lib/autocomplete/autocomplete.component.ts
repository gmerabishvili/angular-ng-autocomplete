import {
  Component, ContentChild,
  ElementRef,
  EventEmitter, forwardRef,
  Input, OnChanges,
  OnInit,
  Output,
  Pipe,
  PipeTransform, Renderer2,
  SimpleChanges, TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  host: {
    '(document:click)': 'handleClick($event)',
    'class': 'ng-autocomplete'
  },
})

export class AutocompleteComponent implements OnInit, OnChanges, ControlValueAccessor {
  @ViewChild('searchInput') searchInput: ElementRef; // input element
  @ViewChild('filteredListElement') filteredListElement: ElementRef; // element of items
  @ViewChild('historyListElement') historyListElement: ElementRef; // element of history items

  inputKeyUp$: Observable<any>; // input events
  inputKeyDown$: Observable<any>; // input events

  public query = ''; // search query
  public filteredList = []; // list of items
  public historyList = []; // list of history items
  public isHistoryListVisible = true;
  public elementRef;
  public selectedIdx = -1;
  public toHighlight: string = '';
  public notFound = false;
  public isFocused = false;
  public isOpen = false;
  public isScrollToEnd = false;

  // inputs
  /**
   * Data of items list.
   * It can be array of strings or array of objects.
   */
  @Input() public data = [];
  @Input() public searchKeyword: string; // keyword to filter the list
  @Input() public placeHolder = ''; // input placeholder
  @Input() public initialValue: any; // set initial value
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
  /**
   * The minimum number of characters the user must type before a search is performed.
   */
  @Input() public minQueryLength = 1;


  // output events
  /** Event that is emitted whenever an item from the list is selected. */
  @Output() selected = new EventEmitter();

  /** Event that is emitted whenever an input is changed. */
  @Output() inputChanged = new EventEmitter();

  /** Event that is emitted whenever an input is focused. */
  @Output() readonly inputFocused: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted whenever an input is cleared. */
  @Output() readonly inputCleared: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is opened. */
  @Output() readonly opened: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when the autocomplete panel is closed. */
  @Output() readonly closed: EventEmitter<void> = new EventEmitter<void>();

  /** Event that is emitted when scrolled to the end of items. */
  @Output() scrolledToEnd = new EventEmitter();


  // custom templates
  @ContentChild(TemplateRef)
  @Input() itemTemplate: TemplateRef<any>;
  @Input() notFoundTemplate: TemplateRef<any>;

  /**
   * Propagates new value when model changes
   */
  propagateChange: any = () => {
  };


  /**
   * Writes a new value from the form model into the view,
   * Updates model
   */
  writeValue(value: any) {
    if (value) {
      this.query = value;
    }
  }

  /**
   * Registers a handler that is called when something in the view has changed
   */
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  /**
   * Registers a handler specifically for when a control receives a touch event
   */
  registerOnTouched(fn: () => void): void {
  }

  /**
   * Event that is called when the value of an input element is changed
   */
  onChange(event) {
    this.propagateChange(event.target.value);
  }

  constructor(elementRef: ElementRef, private renderer: Renderer2) {
    this.elementRef = elementRef;
  }

  ngOnInit() {
    this.handleScroll();
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
      this.handleItemsChange();
      if (!changes.data.firstChange && this.isFocused) {
        this.open();
      }
    }
  }

  /**
   * Items change
   */
  public handleItemsChange() {
    this.isScrollToEnd = false;
    if (!this.isOpen) {
      return;
    }

    this.filteredList = this.data;
  }

  /**
   * Filter data
   */
  public filterList() {
    this.selectedIdx = -1;
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
    this.isOpen = true;
    this.selected.emit(item);
    this.propagateChange(item);

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
        } else {
          // if selected item exists in existingHistory swap to top in array
          if (!this.isType(item)) {
            // object logic
            const copiedExistingHistory = existingHistory.slice(); // copy original existingHistory array
            const selectedIndex = copiedExistingHistory.map((el) => el[this.searchKeyword]).indexOf(item[this.searchKeyword]);
            copiedExistingHistory.splice(selectedIndex, 1);
            copiedExistingHistory.splice(0, 0, item);
            localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(copiedExistingHistory));
          } else {
            // string logic
            const copiedExistingHistory = existingHistory.slice(); // copy original existingHistory array
            copiedExistingHistory.splice(copiedExistingHistory.indexOf(item), 1);
            copiedExistingHistory.splice(0, 0, item);
            localStorage.setItem(`${this.historyIdentifier}`, JSON.stringify(copiedExistingHistory));
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
   * Scroll items
   */
  public handleScroll() {
    this.renderer.listen(this.filteredListElement.nativeElement, 'scroll', () => {
      this.scrollToEnd();
    });
  }

  /**
   * Remove search query
   */
  public remove(e) {
    e.stopPropagation();
    this.query = '';
    this.inputCleared.emit();
    this.propagateChange(this.query);
    this.isOpen = false;
    this.open();
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
    // If data exists
    if (this.data && this.data.length) {
      this.isOpen = true;
      this.filterList();
      this.opened.emit();
    }
  }

  close() {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.filteredList = [];
    this.selectedIdx = -1;
    this.notFound = false;
    this.isHistoryListVisible = false;
    this.isFocused = false;
    this.closed.emit();
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

  scrollToEnd(): void {
    if (this.isScrollToEnd) {
      return;
    }

    const scrollTop = this.filteredListElement.nativeElement
      .scrollTop;
    const scrollHeight = this.filteredListElement.nativeElement
      .scrollHeight;
    const elementHeight = this.filteredListElement.nativeElement
      .clientHeight;
    const atBottom = scrollHeight === scrollTop + elementHeight;
    if (atBottom) {
      this.scrolledToEnd.emit();
      this.isScrollToEnd = true;
    }
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
      this.onFocusItem(e);
    });

    // enter keyup
    this.inputKeyUp$.pipe(filter(e => isEnter(e.keyCode))).subscribe(e => {
      //this.onHandleEnter();
    });

    // enter keydown
    this.inputKeyDown$.pipe(filter(e => isEnter(e.keyCode))).subscribe(e => {
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
    // if input is empty
    if (!this.query) {
      this.notFound = false;
      this.inputChanged.emit(e.target.value);
      this.inputCleared.emit();
      this.filterList();
    }
    // if query >= to minQueryLength
    if (this.query.length >= this.minQueryLength) {
      this.inputChanged.emit(e.target.value);
      this.filterList();

      // If no results found
      if (!this.filteredList.length) {
        this.notFoundText ? this.notFound = true : this.notFound = false;
      }
    }
  }


  /**
   * Keyboard arrow top and arrow bottom
   * @param e event
   */
  onFocusItem(e) {
    // move arrow up and down on filteredList or historyList
    if (!this.historyList.length || !this.isHistoryListVisible) {
      // filteredList
      const totalNumItem = this.filteredList.length;
      if (e.code === 'ArrowDown') {
        let sum = this.selectedIdx;
        sum = (this.selectedIdx === null) ? 0 : sum + 1;
        this.selectedIdx = (totalNumItem + sum) % totalNumItem;
        this.scrollToFocusedItem(this.selectedIdx);
      } else if (e.code === 'ArrowUp') {
        if (this.selectedIdx == -1) {
          this.selectedIdx = 0;
        }
        this.selectedIdx = (totalNumItem + this.selectedIdx - 1) % totalNumItem;
        this.scrollToFocusedItem(this.selectedIdx);
      }
    } else {
      // historyList
      const totalNumItem = this.historyList.length;
      if (e.code === 'ArrowDown') {
        let sum = this.selectedIdx;
        sum = (this.selectedIdx === null) ? 0 : sum + 1;
        this.selectedIdx = (totalNumItem + sum) % totalNumItem;
        this.scrollToFocusedItem(this.selectedIdx);
      } else if (e.code === 'ArrowUp') {
        if (this.selectedIdx == -1) {
          this.selectedIdx = 0;
        }
        this.selectedIdx = (totalNumItem + this.selectedIdx - 1) % totalNumItem;
        this.scrollToFocusedItem(this.selectedIdx);
      }
    }
  }

  /**
   * Scroll to focused item
   * * @param index
   */
  scrollToFocusedItem(index) {
    let listElement = null;
    // Define list element
    if (!this.historyList.length || !this.isHistoryListVisible) {
      // filteredList element
      listElement = this.filteredListElement.nativeElement;
    } else {
      // historyList element
      listElement = this.historyListElement.nativeElement;
    }

    const items = Array.prototype.slice.call(listElement.childNodes).filter((node: any) => {
      if (node.nodeType === 1) {
        // if node is element
        return node.className.includes('item');
      } else {
        return false;
      }
    });

    if (!items.length) {
      return;
    }

    const listHeight = listElement.offsetHeight;
    const itemHeight = items[index].offsetHeight;
    const visibleTop = listElement.scrollTop;
    const visibleBottom = listElement.scrollTop + listHeight - itemHeight;
    const targetPosition = items[index].offsetTop;

    if (targetPosition < visibleTop) {
      listElement.scrollTop = targetPosition;
    }

    if (targetPosition > visibleBottom) {
      listElement.scrollTop = targetPosition - listHeight + itemHeight;
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
        this.select(this.filteredList[this.selectedIdx]);
      } else {
        // historyList
        this.query = !this.isType(this.historyList[this.selectedIdx])
          ? this.historyList[this.selectedIdx][this.searchKeyword]
          : this.historyList[this.selectedIdx];
        this.saveHistory(this.historyList[this.selectedIdx]);
        this.select(this.historyList[this.selectedIdx]);
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
    // panel is open on delete
    this.isOpen = true;
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
      } else {
        // if selected item exists in historyList swap to top in array
        if (!this.isType(selected)) {
          // object logic
          const copiedHistoryList = this.historyList.slice(); // copy original historyList array
          const selectedIndex = copiedHistoryList.map((item) => item[this.searchKeyword]).indexOf(selected[this.searchKeyword]);
          copiedHistoryList.splice(selectedIndex, 1);
          copiedHistoryList.splice(0, 0, selected);
          this.saveHistoryToLocalStorage([...copiedHistoryList]);
        } else {
          // string logic
          const copiedHistoryList = this.historyList.slice(); // copy original historyList array
          copiedHistoryList.splice(this.historyList.indexOf(selected), 1);
          copiedHistoryList.splice(0, 0, selected);
          this.saveHistoryToLocalStorage([...copiedHistoryList]);
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
      this.filterList();
    }
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
}

@Pipe({name: 'highlight'})
export class HighlightPipe implements PipeTransform {
  transform(text: any, search: any, searchKeyword?: any): any {
    let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    pattern = pattern.split(' ').filter((t) => {
      return t.length > 0;
    }).join('|');
    const regex = new RegExp(pattern, 'gi');

    if (!search) {
      return text;
    }

    if (searchKeyword) {
      const name = text[searchKeyword].replace(regex, (match) => `<b>${match}</b>`);

      return {...text, name};
    } else {
      return search ? text.replace(regex, (match) => `<b>${match}</b>`) : text;
    }
  }
}
