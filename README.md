# Angular Autocomplete (Angular 2 +)
See [Demos](https://ng-autocomplete.github.io/ng-select) or try in [Stackblitz](https://stackblitz.com/edit/ng-autocomplete?file=app%2Fapp.component.ts)

Table of contents
=================

  * [Features](#features)
  * [Getting started](#getting-started)
  * [Usage](#usage)
  * [API](#api)

## Features
- [x] Flexible autocomplete with client/server filtering
- [x] Variable properties and event bindings.
- [x] Selection history
- [x] Custom item and 'not found' templates
- [x] Keyboard navigation
- [x] Accessibility

## Getting started
### Step 1: Install `angular-autocomplete`:

#### NPM
```shell
npm install --save @angular-autocomplete
```
### Step 2: Import the AngularAutocompleteModule:
```js
import { AngularAutocompleteModule } from '@angular-autocomplete';

@NgModule({
  declarations: [AppComponent],
  imports: [AngularAutocompleteModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
### Usage sample

```html
<ng-autocomplete 
  [data]="data"
  [searchKeyword]="keyword"
  (selected)='selectEvent($event)'
  (inputChanged)='onChangeSearch($event)'
  (inputFocused)='inputFocusedEventApi($event)'
  [itemTemplate]="itemTemplateApi"
  [notFoundTemplate]="notFoundTemplate">                                 
</ng-autocomplete>

<ng-template #itemTemplateApi let-item>
<a [innerHTML]="item"></a>
</ng-template>

<ng-template #notFoundTemplate let-notFound>
<div [innerHTML]="notFound"></div>
</ng-template>
```
```javascript

class TestComponent {
  keyword: 'name';
  data: [
     {
       id: 1,
       name: 'Usa',
       population: 10000
     },
     {
       id: 2,
       name: 'England',
       population: 20000
     }
  ];


  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
}
```

## API
### Inputs
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [data] | `Array<any>`  | `null` | yes | Data of items list. It can be array of strings or array of objects. |
| searchKeyword | `string` |  `-` | yes | Variable name to filter data by. |
| placeHolder  | `string` | `-` | no |  HTML `<input>` placeholder text  |
| historyIdentifier  | `string` | `_` | no | History identifier of history list. Usually name of the data array. When valid history identifier is given, then component stores selected item to local storage of user's browser. If it is null then history is hidden. History list is visible if at least one history item is stored. History identifier must be unique.  |
| historyHeading | `string` | `Recently selected` | no | Heading text of history list. If it is null then history heading is hidden. |
| historyListMaxNumber | `number` | `15` | no | Maximum number of items in the history list. |
| notFoundText | `string` | `Not found` | no | Set custom text when filter returns empty result. |
| isLoading | `boolean` | `false` | no | Set the loading state from the parent component when data is being loaded. |
| initialValue | `any` | `_` | no | initial/default selected value. |

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
### Author
* [Giorgi Merabishvili](https://www.linkedin.com/in/giorgi-merabishvili-3719a2121/)


