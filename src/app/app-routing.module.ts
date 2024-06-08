import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MatchesComponent } from './matches/matches.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProfileComponent } from './profile/profile.component';
import { RankingsComponent } from './rankings/rankings.component';
import { AddMatchComponent } from './add-match/add-match.component';
import { PlayerComponent } from './player/player.component';
import { H2HComponent } from './h2-h/h2-h.component';
import { authGuard } from './auth.guard';
import { noUserGuard } from './no-user.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'sign-up', component: SignUpComponent, canActivate: [authGuard] },
  { path: 'sign-in', component: SignInComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [noUserGuard] },
  { path: 'rankings', component: RankingsComponent},
  { path: 'add-match', component: AddMatchComponent, canActivate: [noUserGuard] },
  { path: 'player/:id', component: PlayerComponent},
  { path: 'h2h', component: H2HComponent},
  { path: 'h2h/:id1', component: H2HComponent},
  { path: 'h2h/:id1/:id2', component: H2HComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
