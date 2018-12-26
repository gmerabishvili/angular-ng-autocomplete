import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('ngAutoCompleteStatic') ngAutocompleteStatic;
  @ViewChild('ngAutoCompleteApi') ngAutocompleteApi;


  users;
  public placeholderCountry: string = 'Enter the Country Name';
  public placeholderUser: string = 'Enter the User Name';
  public keywordCountry = 'name';
  public keywordUser = 'name';
  public historyHeading: string = 'Recently selected';
  public isLoading: boolean;
  initialValue = {
    id: 9,
    name: 'Georgia',
    population: 200
  };

  /*public countries = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus',
    'Belgium', 'Bosnia & Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus',
    'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia',
    'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Ireland', 'Italy', 'Kosovo',
    'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Malta',
    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'Norway', 'Poland',
    'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia',
    'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'];*/

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


  constructor(private _dataService: DataService, private _http: HttpClient) {
  }

  ngOnInit() {

  }

  getUsers() {
    this.isLoading = true;
    this._dataService.getUsers().subscribe(res => {
      this.isLoading = false;
      this.users = res['data'];
      //console.log(this.users);
    }, error => {
      this.isLoading = false;
    });
  }

  onChangeSearch(search: string) {
    this.isLoading = true;
    this._http.get(`https://api.github.com/search/repositories?q=${search}&sort=stars&order=desc&limit=10`)
      .toPromise()
      .then((res) => {
        this.isLoading = false;
        this.users = res['items'];
      })
      .catch((err) => {
        //console.log(err);
        this.isLoading = false;
      });
  }

  selectEvent(item) {
    //console.log('Selected', item);
  }

  inputChangedEvent(query) {
    //console.log('query', query);
  }

  inputFocusedEventStatic(e) {
    console.log('static ფოკუსირდა');
  }

  inputFocusedEventApi(e) {
    console.log('Api ფოკუსირდა');
    //this.getUsers();
    this.onChangeSearch('a');
  }

  openedStatic() {
    console.log('static გაიღოოოო');
  }

  closedStatic() {
    console.log('static დაიხურააა');
  }

  openedApi() {
    console.log('api გაიღოოოო');
  }

  closedApi() {
    console.log('api დაიხურააა');
  }

  openStaticPanel(e): void {
    e.stopPropagation();
    this.ngAutocompleteStatic.open();
  }

  closeStaticPanel(e): void {
    e.stopPropagation();
    this.ngAutocompleteStatic.close();
  }

  openApiPanel(e): void {
    e.stopPropagation();
    this.ngAutocompleteApi.open();
  }

  closeApiPanel(e): void {
    e.stopPropagation();
    this.ngAutocompleteApi.close();
  }
}
