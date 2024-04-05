import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoresComponent } from './scores/scores.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JoinTourComponent } from './join-tour/join-tour.component';
import { MatchesComponent } from './matches/matches.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [
    AppComponent,
    ScoresComponent,
    HomeComponent,
    NavbarComponent,
    JoinTourComponent,
    MatchesComponent,
    SignUpComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
