import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private _http: HttpClient) {
  }

  getRepos(value) {
    return this._http.get(`https://api.github.com/search/repositories?q=${value}&sort=stars&order=desc&limit=10`);
  }
}

