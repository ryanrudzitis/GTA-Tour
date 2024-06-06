import { Injectable } from '@angular/core';
import { flag, countries } from 'country-emoji';


@Injectable({
  providedIn: 'root'
})
export class FlagService {

  constructor() { }

  getFlag(country: string): any {
    return flag(country)
  }

  getCountries(): string[] {
    return Object.values(countries)
    .map(([name]) => name)
    .sort();
  }

}
