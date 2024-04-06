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
  joinTourForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    country: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get first_name() {
    return this.joinTourForm.get('first_name')
  }
  get last_name() {
    return this.joinTourForm.get('last_name');
  }
  get email() {
    return this.joinTourForm.get('email');
  }
  get password() {
    return this.joinTourForm.get('password');
  }

  countryNames = Object.values(countries)
    .map(([name]) => name + ' ' + flag(name))
    .sort();

  showSpinner = false;
  
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  async signUpWithEmailPassword(): Promise<void> {
    const email = this.email?.value as string;
    const password = this.password?.value as string;

    await this.authService.signUp(email, password, this.first_name?.value as string, this.last_name?.value as string);
    //TODO handle error
    this.showSpinner = false;
  }

  onSubmit(): void {
    if (!this.joinTourForm.valid) {
      return;
    }
    
    this.showSpinner = true;
    this.signUpWithEmailPassword();
  }
}
