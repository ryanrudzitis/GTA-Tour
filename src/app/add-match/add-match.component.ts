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

  roundOptions: string[] = ['QF', 'SF', 'F'];
  statusOptions: string[] = ['Final', 'Walkover', 'Retired'];
  selectedRound: string = '';
  selectedStatus: string = '';
  tournamentDropdownOptions: TournamentDropdownOption[] = [];
  playerDropdownOptions: PlayerDropdownOption[] = [];
  selectedWinner: string = '';
  selectedLoser: string = '';
  selectedTournament: string = '';

  matchForm = new FormGroup({
    date: new FormControl(''),
    tournament: new FormControl('', [Validators.required]),
    round: new FormControl('', [Validators.required]),
    winner: new FormControl('', [Validators.required]),
    loser: new FormControl('', [Validators.required]),
    set1: new FormControl('', [Validators.required]),
    set2: new FormControl('', [Validators.required]),
    set3: new FormControl(''),
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
  }

  get tournament() {
    return this.matchForm.get('tournament')!;
  }


}
