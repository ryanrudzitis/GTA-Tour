import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

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
    console.log('Form submitted');
    if (!this.SignInForm.valid) {
      return;
    }

    this.signIn();
  }

  signIn(): void {
    console.log('Sign in');
    this.authService.signIn(this.email?.value as string, this.password?.value as string);

  }

}
