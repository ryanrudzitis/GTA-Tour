import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

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


}
