import {NgModule} from '@angular/core';
import {AutocompleteComponent} from './autocomplete.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HighlightPipe} from './highlight.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [AutocompleteComponent, HighlightPipe],
  exports: [ AutocompleteComponent, HighlightPipe]
})
export class AutocompleteLibModule {
}
