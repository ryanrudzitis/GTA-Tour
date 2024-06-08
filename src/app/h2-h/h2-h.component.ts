import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { FlagService } from '../flag.service';

@Component({
  selector: 'app-h2-h',
  templateUrl: './h2-h.component.html',
  styleUrl: './h2-h.component.css',
})
export class H2HComponent {
  id1: string = '';
  id2: string = '';
  player1: any;
  player2: any;
  player1Wins: number = 0;
  player2Wins: number = 0;
  showSpinner = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    public flagService: FlagService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id1 = params['id1'];
      this.id2 = params['id2'];
    });

    if (this.id1 && this.id2) {
      // a proper head to head
      this.showSpinner = true;
      console.log('H2H between', this.id1, 'and', this.id2);
      this.player1 = await this.firebaseService.getUserInfo(this.id1);
      this.player2 = await this.firebaseService.getUserInfo(this.id2);
      console.log('Player 1:', this.player1);
      console.log('Player 2:', this.player2);
      const wins = await this.firebaseService.getH2HWins(this.id1, this.id2);
      this.player1Wins = wins[0];
      this.player2Wins = wins[1];
      this.showSpinner = false;
    } else if (this.id1) {
      // a head to head with a single player
      console.log('H2H with', this.id1);
    } else {
      console.log('H2H');
    }
  }

  
}
