import { Component, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css'],
})
export class MatchComponent {
  @Input() match: any;
  player1: any;
  player2: any;
  player1Id: any;
  player2Id: any;
  player1Name: any;
  player2Name: any;
  player1Score: any;
  player2Score: any;
  status: string | undefined;
  round: string | undefined;
  tournamentId: string = '';
  tournamentName: string = '';

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    console.log('match in component:', this.match);
    await this.initializeMatch();
    // console log all the above
    // console.log('player1:', this.player1);
    // console.log('player2:', this.player2);
    // console.log('status:', this.status);
    // console.log('round:', this.round);
    // console.log('player1Score:', this.player1Score);
    // console.log('player2Score:', this.player2Score);
    // console.log('player1Id:', this.player1Id);
    // console.log('player2Id:', this.player2Id);
    // console.log('player1Name:', this.player1Name);
    // console.log('player2Name:', this.player2Name);
  }

  async initializeMatch(): Promise<void> {
    const { player1, player2, status, round, tournamentId } = this.match;
    this.player1 = player1;
    this.player2 = player2;
    this.status = status;
    this.round = round;
    this.tournamentId = tournamentId;
    this.tournamentName = await this.getTournamentName(tournamentId);
    this.player1Score = player1.score;
    this.player2Score = player2.score;
    this.player1Id = player1.id;
    this.player2Id = player2.id;
    this.player1Name = await this.firebaseService.getUserName(this.player1Id);
    this.player2Name = await this.firebaseService.getUserName(this.player2Id);
  }

  capitalizeFirstLetter(string: string | undefined): string {
    return string!.charAt(0).toUpperCase() + string!.slice(1);
  }

  getAbbreviatedName(name: string): string {
    const firstInitial = name.charAt(0);
    const lastName = name.split(' ')[1];
    return `${firstInitial}. ${lastName}`;
  }

  async getTournamentName(tournamentId: string): Promise<string> {
    return await this.firebaseService.getTournamentName(tournamentId);
  }
}
