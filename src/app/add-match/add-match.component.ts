import { Component, ElementRef, ViewChild } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AuthService } from '../auth.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface PlayerDropdownOption {
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
    /((^6-[0-4]$|^[0-4]-6$)|(7-5|5-7))|(^[7]\(\d+\)-[6]\(\d+\)$|^[6]\(\d+\)-[7]\(\d+\)$)/;
  finalScoreRegexUnrequired =
    /^$|((^6-[0-4]$|^[0-4]-6$)|(7-5|5-7))|(^[7]\(\d+\)-[6]\(\d+\)$|^[6]\(\d+\)-[7]\(\d+\)$)/;
  incompleteScoreRegex =
    /(^[0-6]-[0-4]$|^[0-4]-[0-6]$|(7-5|5-7))|(^[7]\(\d+\)-[6]\(\d+\)$|^[6]\(\d+\)-[7]\(\d+\)$)/;
  incompleteScoreRegexUnrequired =
    /^$|(^[0-6]-[0-4]$|^[0-4]-[0-6]$|(7-5|5-7))|(^[7]\(\d+\)-[6]\(\d+\)$|^[6]\(\d+\)-[7]\(\d+\)$)/;

  @ViewChild("top") topOfPage: ElementRef | undefined;

  roundOptions: any[] = [ {
    name: 'Quarterfinal',
    value: 'qf'
  }, {
    name: 'Semifinal',
    value: 'sf'
  }, {
    name: 'Final',
    value: 'f'
  
  }]
  statusOptions: string[] = ['Final', 'Walkover', 'Retired'];
  allTournaments: any[] = [];
  playerDropdownOptions: PlayerDropdownOption[] = [];
  selectedWinner: string = '';
  showSpinner: boolean = true;

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

  constructor(private firebaseService: FirebaseService, private _snackBar: MatSnackBar, private authService: AuthService) {

  }

  async ngOnInit() {
    let allPlayers = await this.firebaseService.getAllPlayers();
    allPlayers.sort((a: any, b: any) => {
      return a.lastName.localeCompare(b.lastName);
    });
    this.allTournaments = await this.firebaseService.getAllTournaments();
    this.buildPlayerDropdown(allPlayers);
    this.showSpinner = false;
    this.statusListener();
    this.tournamentListener();
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

  async onSubmit(formDirective: any): Promise<void> {
    if (!this.matchForm.valid) {
      console.log('form is invalid');
      return;
    } 

    this._snackBar.open('Adding match...');
    // get the form values
    const formValues = this.matchForm.value;
    console.log('formValues:', formValues);

    try {
      await this.firebaseService.addMatch(formValues);
      let snackBarRef = this._snackBar.open('Match added', 'Close', {
        duration: 5000,
      });

      this.matchForm.reset();
      formDirective.resetForm();
      this.matchForm.controls['date'].setValue(new Date());
      this.matchForm.controls['status'].setValue('Final');
      this.matchForm.controls['set1'].setValue('');
      this.matchForm.controls['set2'].setValue('');
      this.matchForm.controls['set3'].setValue('');
      // scroll to the top of the page
      this.topOfPage?.nativeElement.scrollIntoView({ behavior: "smooth" });
      
    } catch (error) {
      console.error('Error adding match:', error);
      this._snackBar.open('Error adding match', 'Close');
    }

  }

  /**
   * Get the tournament field
   * @returns {AbstractControl}
   */
  get tournament(): AbstractControl {
    return this.matchForm.get('tournament')!;
  }

  /**
   * Listen for changes to the status field, and update the validation rules for the set fields accordingly
   * @returns {void}
   */
  statusListener(): void {
    this.matchForm.get('status')?.valueChanges.subscribe((value) => {

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

  /**
   * Listen for changes to the tournament field, and disables the round field if the tournament is a league match
   * @returns {void}
   */
  tournamentListener(): void {
    this.matchForm.get('tournament')?.valueChanges.subscribe((value: any) => {
      if (value?.name === 'League Match') {
        this.matchForm.get('round')?.disable();
      } else {
        this.matchForm.get('round')?.enable();
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
