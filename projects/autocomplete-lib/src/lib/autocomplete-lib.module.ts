import {NgModule} from '@angular/core';
import {AutocompleteLibComponent} from './autocomplete-lib.component';
import {AutocompleteComponent} from './autocomplete/autocomplete.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HighlightPipe} from './autocomplete/highlight.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [AutocompleteLibComponent, AutocompleteComponent, HighlightPipe],
  exports: [AutocompleteLibComponent, AutocompleteComponent, HighlightPipe]
})
export class AutocompleteLibModule {
}
