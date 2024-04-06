import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  invalidCredError = false;
  showSpinner = false;
  SignInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required
    ]),
  });

  get email() {
    return this.SignInForm.get('email');
  }
  get password() {
    return this.SignInForm.get('password');
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.invalidCredError = false;

    if (!this.SignInForm.valid) {
      let field = null;

      if (this.email?.errors?.['required']) {
        field = document.querySelector('#emailInput') as HTMLElement;
      } else if (this.password?.errors?.['required']) {
        field = document.querySelector('#passwordInput') as HTMLElement;
      }
      if (field) field.focus();
      return;
    }

    this.showSpinner = true;
    this.signIn();
  }

  signIn(): void {
    this.authService.signIn(this.email?.value as string, this.password?.value as string)
    .then(() => {
      console.log('Signed in');
    })
    .catch((error) => {
      console.error('Error signing in:', error);
      if (error.code === 'auth/invalid-credential') {
        //clear password field
        this.SignInForm.patchValue({
          password: ''
        });
        // focus on password field
        const passwordField = document.querySelector('#passwordInput') as HTMLElement;
        passwordField.focus();
        // effectively clears form errors
        this.SignInForm.markAsUntouched();

        this.invalidCredError = true;
      } else {
        console.error('Error signing in:', error);
      }
    })
    .finally(() => {
      this.showSpinner = false;
    });

  }

}
