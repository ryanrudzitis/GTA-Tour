import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { flag, code, name, countries } from 'country-emoji';

@Component({
  selector: 'app-join-tour',
  templateUrl: './join-tour.component.html',
  styleUrls: ['./join-tour.component.css']
})
export class JoinTourComponent {
  joinTourForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    country: new FormControl(''),
  });
  
  countryNames = Object.values(countries).map(([name]) => name + ' ' + flag(name)).sort();

  constructor() { }

  ngOnInit(): void {
    console.log(this.countryNames);
  }

  onSubmit(): void {
    console.log(this.joinTourForm.value);
  }
}
