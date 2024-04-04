import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ScoresComponent } from './scores/scores.component';
import { HomeComponent } from './home/home.component';
import { JoinTourComponent } from './join-tour/join-tour.component';
import { MatchesComponent } from './matches/matches.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'scores', component: ScoresComponent },
  { path: 'join-tour', component: JoinTourComponent },
  { path: 'matches', component: MatchesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
