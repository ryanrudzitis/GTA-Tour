import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute } from '@angular/router';
import { FlagService } from '../flag.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {

  playerId: string = '';
  player: any;
  playerMatches: any[] = [];
  showSpinner = true;
  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, public flagService: FlagService) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.playerId = params['id'];
      this.player = await this.firebaseService.getUserInfo(this.playerId);
      this.playerMatches = await this.firebaseService.getMatchesForUser(this.playerId);
      this.showSpinner = false;
    });
  }
}
