import { Component, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FlagService } from '../flag.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css'],
})
export class MatchComponent {
  @Input() match: any;
  @Input() showTournament: boolean = true;
  winner: string = '';
  winnerName: string = '';
  winnerFlag: any;
  winnerInfo: any;
  loser: string = '';
  loserName: string = '';
  loserFlag: any;
  loserInfo: any;
  winnerId: string = '';
  loserId: string = '';
  set1: string = '';
  set2: string = '';
  set3: string = '';
  winnerSetScores: string = '';
  loserSetScores: string = '';
  status: string = '';
  round: any;
  tournament: string = '';
  tournamentName: string = '';
  date: string = '';
  dateString: string = '';
  showSpinner: boolean = true;

  constructor(private firebaseService: FirebaseService, public flagService: FlagService) {}

  async ngOnInit(): Promise<void> {
    await this.initializeMatch();
    this.showSpinner = false;

  }

  async initializeMatch(): Promise<void> {
    Object.assign(this, this.match);
    this.tournamentName = await this.getTournamentName(this.tournament);
    this.winnerName = await this.getPlayerName(this.winner);
    this.loserName = await this.getPlayerName(this.loser);
    this.winnerInfo = await this.firebaseService.getUserInfo(this.winner);
    this.loserInfo = await this.firebaseService.getUserInfo(this.loser);
    this.getWinnerSets();
    this.getLoserSets();
  }

  capitalizeFirstLetter(string: string | undefined): string {
    return string!.charAt(0).toUpperCase() + string!.slice(1);
  }

  getAbbreviatedName(fullName: string): string {
    const firstInitial = fullName.charAt(0);
    const lastName = fullName.split(' ')[1];
    return `${firstInitial}. ${lastName}`;
  }

  async getTournamentName(tournamentId: string): Promise<string> {
    return await this.firebaseService.getTournamentName(tournamentId);
  }

  async getPlayerName(playerId: string): Promise<string> {
    return await this.firebaseService.getPlayerName(playerId);
  }

  getWinnerSets(): void {
    const set1 = this.set1.split('-')[0];
    const set2 = this.set2.split('-')[0];
    let set3;
    if (this.set3 != '') {
      set3 = this.set3.split('-')[0];
      this.winnerSetScores = set1 + '  ' + set2 + '  ' + set3;
    } else {
      this.winnerSetScores = set1 + '  ' + set2;
    }
    
  }

  getLoserSets(): void {
    const set1 = this.set1.split('-')[1];
    const set2 = this.set2.split('-')[1];
    let set3;
    if (this.set3 != '') {
      set3 = this.set3.split('-')[1];
      this.loserSetScores = set1 +  '  ' + set2 + '  ' + set3;
    } else {
      this.loserSetScores = set1 + '  ' + set2;
    }
  }
}
