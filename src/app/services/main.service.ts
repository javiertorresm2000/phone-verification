import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  private API_RESTCOUNTRIES = 'https://restcountries.com/v2/';
  private API_NUMVERIFY = 'http://apilayer.net/api/';
  
  private accessKey = 'eb588dbf70cb81df1c8d374269db9d18';

  
  constructor(private http:HttpClient) { }
  
  getCountries():Observable<any>{
    return this.http.get(`${this.API_RESTCOUNTRIES}/all`);
  }

  verifyNumber(number, code):Observable<any>{
    return this.http.get(`${this.API_NUMVERIFY}/validate?access_key=${this.accessKey}&number=${number}&country_code=${code}`);
  }
}