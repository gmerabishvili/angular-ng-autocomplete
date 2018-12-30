# Angular Autocomplete (Angular 2 +)
See [Demo](https://gmerabishvili.github.io/angular-ng-autocomplete/) or try in [Stackblitz](https://stackblitz.com/edit/angular-ng-autocomplete)

Table of contents
=================

  * [Features](#features)
  * [Getting started](#getting-started)
  * [Usage](#usage)
  * [API](#api)
  * [Styles](#styles)

## Features
- [x] Flexible autocomplete with client/server filtering.
- [x] Variable properties and event bindings.
- [x] Selection history.
- [x] Custom item and 'not found' templates.
- [x] Keyboard navigation.
- [x] Accessibility.

## Getting started
### Step 1: Install `angular-ng-autocomplete`:

#### NPM
```shell
npm i angular-ng-autocomplete
```
### Step 2: Import the AutocompleteLibModule:
```js
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

@NgModule({
  declarations: [AppComponent],
  imports: [AutocompleteLibModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
### Usage sample

```html
<div class="ng-autocomplete">
<ng-autocomplete 
  [data]="data"
  [searchKeyword]="keyword"
  (selected)='selectEvent($event)'
  (inputChanged)='onChangeSearch($event)'
  (inputFocused)='onFocused($event)'
  [itemTemplate]="itemTemplate"
  [notFoundTemplate]="notFoundTemplate">                                 
</ng-autocomplete>

<ng-template #itemTemplate let-item>
<a [innerHTML]="item"></a>
</ng-template>

<ng-template #notFoundTemplate let-notFound>
<div [innerHTML]="notFound"></div>
</ng-template>
</div>

```
```javascript

class TestComponent {
  keyword: 'name';
  data: [
     {
       id: 1,
       name: 'Usa'
     },
     {
       id: 2,
       name: 'England'
     }
  ];


  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e){
    // do something
  }
}
```

## API
### Inputs
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [data] | `Array<any>`  | `null` | yes | Data of items list. It can be array of strings or array of objects. |
| searchKeyword | `string` |  `-` | yes | Variable name to filter data by. |
| placeHolder  | `string` | `-` | no |  HTML `<input>` placeholder text.  |
| initialValue | `any` | `_` | no | initial/default selected value. |
| historyIdentifier  | `string` | `_` | no | History identifier of history list. When valid history identifier is given, then component stores selected item to local storage of user's browser. If it is null then history is hidden. History list is visible if at least one history item is stored. History identifier must be unique.  |
| historyHeading | `string` | `Recently selected` | no | Heading text of history list. If it is null then history heading is hidden. |
| historyListMaxNumber | `number` | `15` | no | Maximum number of items in the history list. |
| notFoundText | `string` | `Not found` | no | Set custom text when filter returns empty result. |
| isLoading | `boolean` | `false` | no | Set the loading state from the parent component when data is being loaded. |
| debounceTime | `number` | `400` | no | Delay time while typing. |

### Outputs
| Output  | Description |
| ------------- | ------------- |
| (selected) | Event is emitted when an item from the list is selected. |
| (inputChanged) | Event is emitted when an input is changed. |
| (inputFocused) | Event is emitted when an input is focused. |
| (opened)  | Event is emitted when the autocomplete panel is opened. |
| (closed)  | Event is emitted when the autocomplete panel is closed. |


### Methods (controls)
 Name  | Description |
| ------------- | ------------- |
| open  | Opens the autocomplete panel |
| close | Closes the autocomplete panel |
| focus | Focuses the autocomplete input element |

To access the control methods of the component you should use  `@ViewChild` decorator.
See the example below:

```html
<ng-autocomplete #auto></ng-autocomplete>
```

```javascript
class TestComponent {
  @ViewChild('auto') auto;

  openPanel(e): void {
    e.stopPropagation();
    this.auto.open();
  }
  
  closePanel(e): void {
    e.stopPropagation();
    this.auto.close();
    }
    
  focus(e): void {
    this.auto.focus();
  }  
}
``` 

## Styles
If you are not happy with default styles you can easily override them:

```html
<div class="ng-autocomplete">
<ng-autocomplete></ng-autocomplete>
</div>
```

```css
.ng-autocomplete {
    width: 400px;
}
```

### Author
* [Giorgi Merabishvili](https://www.linkedin.com/in/giorgi-merabishvili-3719a2121/)


