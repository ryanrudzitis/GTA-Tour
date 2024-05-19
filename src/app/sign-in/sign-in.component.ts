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

  constructor(private authService: AuthService) { 
    console.log("current user", this.authService.currentUser)
  }

  ngOnInit(): void {

  }

  async onSubmit(formDirective: any): Promise<void> {
    this.invalidCredError = false;

    if (!this.SignInForm.valid) {
      console.log('Form is invalid');
    }

    this.showSpinner = true;
    await this.signIn(formDirective);
  }

  async signIn(formDirective: any): Promise<void> {
    this.authService.signIn(this.email?.value as string, this.password?.value as string)
    .then(() => {
      console.log('Signed in');
    })
    .catch((error) => {
      console.error('Error signing in:', error);
      if (error.code === 'auth/invalid-credential') {
        //reset form, but keep email first
        const email = this.email?.value;
        this.SignInForm.reset();
        formDirective.resetForm();
        if (email) this.email?.setValue(email);
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
