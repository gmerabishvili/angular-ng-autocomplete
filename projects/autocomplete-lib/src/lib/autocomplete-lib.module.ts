import {NgModule} from '@angular/core';
import {AutocompleteLibComponent} from './autocomplete-lib.component';
import {AutocompleteComponent, HighlightPipe} from './autocomplete/autocomplete.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [AutocompleteLibComponent, AutocompleteComponent, HighlightPipe],
  exports: [AutocompleteLibComponent, AutocompleteComponent]
})
export class AutocompleteLibModule {
}
