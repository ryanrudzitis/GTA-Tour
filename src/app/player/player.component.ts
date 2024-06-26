import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute } from '@angular/router';
import { FlagService } from '../flag.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent {
  playerId: string = '';
  player: any;
  playerMatches: any[] = [];
  showSpinner = true;
  rank: number = 0;
  titles: number = 0;
  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    public flagService: FlagService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      this.playerId = params['id'];
      this.player = await this.firebaseService.getUserInfo(this.playerId);
      this.playerMatches = await this.firebaseService.getMatchesForUser(
        this.playerId
      );
      this.rank = await this.firebaseService.getRank(this.playerId);
      this.titles = await this.firebaseService.getNumTitles(this.playerId);
      this.showSpinner = false;
    });
  }

  async directH2H() {
    console.log('setting up h2h');
    const userId = this.authService.currentUser?.uid as string;
    // now open up the h2h page with router link
    this.router.navigate(['/h2h', userId, this.playerId]);
  }
}
