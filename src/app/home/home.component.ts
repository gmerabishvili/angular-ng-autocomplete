import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('ngAutoCompleteStatic') ngAutocompleteStatic;
  @ViewChild('ngAutoCompleteApi') ngAutocompleteApi;

  items;
  public placeholder: string = 'Enter the Country Name';
  public keyword = 'name';
  public historyHeading: string = 'Recently selected';
  public isLoading: boolean;
  initialValue = {
    id: 9,
    name: 'Georgia',
    population: 200
  };

  /**
   * Static Data
   */

  public countries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
    'Belgium', 'Bosnia & Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',
    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',
    'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Ireland', 'Italy', 'Kosovo',
    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta',
    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];

  /*
    public countries = [
      {
        id: 1,
        name: 'Albania',
        population: 100
      },
      {
        id: 2,
        name: 'Belgium',
        population: 200
      },
      {
        id: 3,
        name: 'Denmark',
        population: 200
      },
      {
        id: 4,
        name: 'Montenegro',
        population: 200
      },
      {
        id: 5,
        name: 'Turkey',
        population: 200
      },
      {
        id: 6,
        name: 'Ukraine',
        population: 200
      },
      {
        id: 7,
        name: 'Macedonia',
        population: 200
      },
      {
        id: 8,
        name: 'Slovenia',
        population: 200
      },
      {
        id: 9,
        name: 'Georgia',
        population: 200
      },
      {
        id: 10,
        name: 'India',
        population: 200
      },
      {
        id: 11,
        name: 'Russia',
        population: 200
      },
      {
        id: 12,
        name: 'Switzerland',
        population: 200
      }
    ];
  */

  constructor(private _dataService: DataService) {
  }

  ngOnInit() {
  }

  /**
   * API Data
   */
  onChangeSearch(val: string) {
    console.log('value', val);
    this.isLoading = true;
    this._dataService.getRepos(val).subscribe(res => {
      //console.log('res', res);
      this.items = res['items'];
      this.isLoading = false;
    }, (err) => {
      console.log('err', err);
      this.isLoading = false;
    });
  }

  selectEvent(item) {
    console.log('Selected item', item);
  }

  /**
   * Static
   */

  changeEventStatic(query) {
    //console.log('query', query);
  }

  focusEventStatic(e) {
    console.log('focused');
  }

  clearEventStatic() {
    console.log('cleared');
  }

  openedStatic() {
    console.log('opened');
  }

  closedStatic() {
    console.log('closed');
  }

  openStaticPanel(e): void {
    console.log('open');
    e.stopPropagation();
    this.ngAutocompleteStatic.open();
  }

  closeStaticPanel(e): void {
    console.log('close');
    e.stopPropagation();
    this.ngAutocompleteStatic.close();
  }

  focusStaticPanel(e): void {
    console.log('focus');
    e.stopPropagation();
    this.ngAutocompleteStatic.focus();
  }

  /**
   * End of Static
   */


  /**
   * API
   */

  focusedEventApi(e) {
    console.log('focused');
    // Fetch API data on Load
    this.onChangeSearch(null);
  }


  openedEventApi() {
    console.log('opened');
  }

  closedEventApi() {
    console.log('closed');
  }

  clearEventApi() {
    console.log('cleared');
  }


  openApiPanel(e): void {
    console.log('open');
    e.stopPropagation();
    this.ngAutocompleteApi.open();
  }

  closeApiPanel(e): void {
    console.log('close');
    e.stopPropagation();
    this.ngAutocompleteApi.close();
  }

  focusApiPanel(e): void {
    console.log('focus');
    e.stopPropagation();
    this.ngAutocompleteApi.focus();
  }

  /**
   * End of API
   */

}
