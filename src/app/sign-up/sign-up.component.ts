import { Component } from '@angular/core';
import { flag, code, name, countries } from 'country-emoji';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  countryNames = Object.values(countries)
    .map(([name]) => name)
    .sort();

  showSpinner = false;

  signInForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get firstName() {
    return this.signInForm.get('first_name');
  }
  get lastName() {
    return this.signInForm.get('last_name');
  }
  get country() {
    return this.signInForm.get('country');
  }
  get email() {
    return this.signInForm.get('email');
  }
  get password() {
    return this.signInForm.get('password');
  }

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  getCountryFlag(country: string): string | undefined {
    return flag(country);
  }

  async onSubmit(): Promise<void> {
    if (!this.signInForm.valid) {
      console.log('Form is invalid');
      return;
    }

    this.showSpinner = true;
    await this.authService.signUp(this.signInForm.value);
    this.showSpinner = false;
  }
}
