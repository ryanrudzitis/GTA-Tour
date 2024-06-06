import { Injectable } from '@angular/core';
import { flag } from 'country-emoji';


@Injectable({
  providedIn: 'root'
})
export class FlagService {

  constructor() { }

  getFlag(country: string): any {
    return flag(country)
  }
}
