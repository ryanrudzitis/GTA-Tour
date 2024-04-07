import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoresComponent } from './scores/scores.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatchesComponent } from './matches/matches.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase';
import { ProfileComponent } from './profile/profile.component';
import { RankingsComponent } from './rankings/rankings.component';
import { MatchComponent } from './match/match.component';

const app = initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    ScoresComponent,
    HomeComponent,
    NavbarComponent,
    MatchesComponent,
    SignUpComponent,
    SignInComponent,
    ProfileComponent,
    RankingsComponent,
    MatchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
