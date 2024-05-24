import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ScoresComponent } from './scores/scores.component';
import { HomeComponent } from './home/home.component';
import { MatchesComponent } from './matches/matches.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProfileComponent } from './profile/profile.component';
import { RankingsComponent } from './rankings/rankings.component';
import { AddMatchComponent } from './add-match/add-match.component';
import { PlayerComponent } from './player/player.component';
import { authGuard } from './auth.guard';
import { noUserGuard } from './no-user.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'scores', component: ScoresComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'sign-up', component: SignUpComponent, canActivate: [authGuard] },
  { path: 'sign-in', component: SignInComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [noUserGuard] },
  { path: 'rankings', component: RankingsComponent},
  { path: 'add-match', component: AddMatchComponent, canActivate: [noUserGuard] },
  { path: 'player/:id', component: PlayerComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
