import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

interface PlayerDropdownOption {
  id: string;
  name: string;
}

interface TournamentDropdownOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css']
})

export class AddMatchComponent {

  setScoreRegex = /^\d-\d$|\d\(\d+\)-\d\(\d+\)/;
  setScoreRegexUnrequired = /^$|^\d-\d$|\d\(\d+\)-\d\(\d+\)/;

  roundOptions: string[] = ['QF', 'SF', 'F'];
  statusOptions: string[] = ['Final', 'Walkover', 'Retired'];
  tournamentDropdownOptions: TournamentDropdownOption[] = [];
  playerDropdownOptions: PlayerDropdownOption[] = [];
  selectedWinner: string = '';

  matchForm = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    tournament: new FormControl('', [Validators.required]),
    round: new FormControl('', [Validators.required]),
    winner: new FormControl('', [Validators.required]),
    loser: new FormControl('', [Validators.required]),
    set1: new FormControl('', [Validators.required, Validators.pattern(this.setScoreRegex)]),
    set2: new FormControl('', [Validators.required, Validators.pattern(this.setScoreRegex)]),
    set3: new FormControl('', [Validators.pattern(this.setScoreRegexUnrequired)]),
    status: new FormControl('Final', [Validators.required]),
  });

  constructor(private firebaseService: FirebaseService) {
    
  }

  async ngOnInit() {
    const allPlayers = await this.firebaseService.getAllPlayers();
    const allTournaments = await this.firebaseService.getAllTournaments();
    this.buildPlayerDropdown(allPlayers);
    this.buildTournamentDropdown(allTournaments);
    console.log(this.playerDropdownOptions);
    console.log(this.tournamentDropdownOptions);
  }

  /**
   * Build the player dropdown options
   * @param {any[]} allPlayers - Array of all players
   * @returns {void}
   */
  buildPlayerDropdown(allPlayers: any[]): void {
    this.playerDropdownOptions = allPlayers.map((player) => {
      return {
        id: player.id,
        name: `${player.firstName} ${player.lastName}`,
      };
    });
  }

  buildTournamentDropdown(allTournaments: any[]): void {
    this.tournamentDropdownOptions = allTournaments.map((tournament) => {
      return {
        id: tournament.id,
        name: tournament.name,
      };
    });
  }

  onSubmit(): void {
    console.log(this.matchForm.value);
    console.log("form submitted");

    // check if the form is valid
    if (this.matchForm.valid) {
      console.log("form is valid");
    } else {
      console.log("form is invalid");

    }
  }

  get tournament() {
    return this.matchForm.get('tournament')!;
  }


}
