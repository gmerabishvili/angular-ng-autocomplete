import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../services/data.service';
import {Country, Icountry} from '../models/countries';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('ngAutoCompleteStatic') ngAutocompleteStatic;
  @ViewChild('ngAutoCompleteApi') ngAutocompleteApi;
  @ViewChild('userAuto') userAuto;

  private users$: Observable<any>;


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

  /*  public countries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
      'Belgium'];*/

  public test = ['Lithuania', 'Luxembourg', 'Macedonia', 'Malta',
    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];

  public countries: Country[] = [
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

  constructor(private _dataService: DataService) {
  }

  ngOnInit() {
    this.countries.push(new Country(1, 'Yeah', 100));
    this.countries.push(new Country(2, 'Yep', 200));

    this.users$ = this._dataService.getUsers();
  }

  /**
   * API Data  (Filter on server)
   */
  onChangeSearch(term: string) {
    console.log('term', term);
    this.isLoading = true;
    this._dataService.getRepos(term).subscribe(res => {
      console.log('res', res);
      //this.items = this.items ? this.items.concat(res['items']) : res['items'];
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

  changeEventStatic(string: string) {
    console.log('string', string);
  }

  focusEventStatic(e) {
    console.log('focused', e);
    //this.ngAutocompleteStatic.close();
  }

  clearEventStatic() {
    console.log('cleared');
    //this.ngAutocompleteStatic.close();
  }

  scrollToEndStatic() {
    console.log('scrolled-to-bottom');
    //this.countries = [...this.countries, ...this.test];
    //console.log('countriesssss', this.countries);
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

  clearStatic(e): void {
    console.log('clear');
    e.stopPropagation();
    this.ngAutocompleteStatic.clear();
  }

  clearAndCloseStatic() {
    this.ngAutocompleteStatic.close();
    this.ngAutocompleteStatic.clear();
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

  scrollToEndApi() {
    this.onChangeSearch('w');
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


  /**
   * API Data  (Filter on local)
   */
  selectUser(user) {
    console.log('Selected user', user);
  }

  onUserChange(term: string) {
    console.log('term', term);
  }

  scrollToEndUsers() {
    console.log('scrolled-to-bottom');
  }

  openUserPanel(e): void {
    console.log('open');
    e.stopPropagation();
    this.userAuto.open();
  }

  closeUserPanel(e): void {
    console.log('close');
    e.stopPropagation();
    this.userAuto.close();
  }

  focusUserPanel(e): void {
    console.log('focus');
    e.stopPropagation();
    this.userAuto.focus();
  }
}
