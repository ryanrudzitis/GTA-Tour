import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';

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
  styleUrls: ['./add-match.component.css'],
})
export class AddMatchComponent {
  finalScoreRegex =
    /((6-[0-4]|[0-4]-6)|(7-5|5-7))|([7]\(\d+\)-[6]\(\d+\)|[6]\(\d+\)-[7]\(\d+\))/;
  finalScoreRegexUnrequired =
    /^$|((6-[0-4]|[0-4]-6)|(7-5|5-7))|([7]\(\d+\)-[6]\(\d+\)|[6]\(\d+\)-[7]\(\d+\))/;
  incompleteScoreRegex =
    /([0-6]-[0-4]|[0-4]-[0-6]|(7-5|5-7))|([7]\(\d+\)-[6]\(\d+\)|[6]\(\d+\)-[7]\(\d+\))/;
  incompleteScoreRegexUnrequired =
    /^$|([0-6]-[0-4]|[0-4]-[0-6]|(7-5|5-7))|([7]\(\d+\)-[6]\(\d+\)|[6]\(\d+\)-[7]\(\d+\))/;

  roundOptions: string[] = ['Quarterfinals', 'Semifinals', 'Finals'];
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
    set1: new FormControl('', [
      Validators.required,
      Validators.pattern(this.finalScoreRegex),
    ]),
    set2: new FormControl('', [
      Validators.required,
      Validators.pattern(this.finalScoreRegex),
    ]),
    set3: new FormControl('', [
      Validators.pattern(this.finalScoreRegexUnrequired),
    ]),
    status: new FormControl('Final', [Validators.required]),
  });

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    const allPlayers = await this.firebaseService.getAllPlayers();
    const allTournaments = await this.firebaseService.getAllTournaments();
    this.buildPlayerDropdown(allPlayers);
    this.buildTournamentDropdown(allTournaments);
    console.log(this.playerDropdownOptions);
    console.log(this.tournamentDropdownOptions);
    this.statusListener();
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

  async onSubmit(): Promise<void> {
    console.log(this.matchForm.value);
    console.log('form submitted');

    // check if the form is valid
    if (!this.matchForm.valid) {
      console.log('form is invalid');
      return;
    } 

    // get the form values
    const formValues = this.matchForm.value;
    await this.firebaseService.addMatch(formValues);
  }

  get tournament() {
    return this.matchForm.get('tournament')!;
  }

  /**
   * Listen for changes to the status field, and update the validation rules for the set fields accordingly
   */
  statusListener() {
    this.matchForm.get('status')?.valueChanges.subscribe((value) => {
      console.log('status changed to ', value);

      if (value === 'Final') {
        this.matchForm
          .get('set1')
          ?.setValidators([
            Validators.required,
            Validators.pattern(this.finalScoreRegex),
          ]);
        this.matchForm
          .get('set2')
          ?.setValidators([
            Validators.required,
            Validators.pattern(this.finalScoreRegex),
          ]);
        const value = this.matchForm.get('set2')?.getRawValue();
        this.matchForm.get('set2')?.reset();
        this.matchForm.get('set2')?.setValue(value);

        this.matchForm
          .get('set3')
          ?.setValidators([Validators.pattern(this.finalScoreRegexUnrequired)]);
      } else if (value === 'Walkover' || value === 'Retired') {
        this.matchForm
          .get('set1')
          ?.setValidators([
            Validators.required,
            Validators.pattern(this.incompleteScoreRegex),
          ]);
        this.matchForm
          .get('set2')
          ?.setValidators([Validators.pattern(this.incompleteScoreRegex)]);
        const value = this.matchForm.get('set2')?.getRawValue();
        this.matchForm.get('set2')?.reset(); // gets rid of the asterisk that appears in the input field
        this.matchForm.get('set2')?.setValue(value);
        this.matchForm
          .get('set3')
          ?.setValidators([
            Validators.pattern(this.incompleteScoreRegexUnrequired),
          ]);
      }
    });
  }
}
