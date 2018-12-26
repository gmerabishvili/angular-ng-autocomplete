import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  clientID: string = 'PAST YOUR CLIENT ID';
  baseUrl: string = 'https://api.spotify.com/v1/search?type=artist&limit=10&client_id=' + this.clientID + '&q=';


  constructor(private _http: HttpClient) {
  }

  getUsers() {
    return this._http.get('https://reqres.in/api/users');
  }
}
