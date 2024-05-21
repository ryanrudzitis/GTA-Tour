import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent {

  matches: any[] = [];
  showSpinner: boolean = true;

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    this.matches = await this.firebaseService.getAllMatches();
    console.log('matches:', this.matches);
    //sort matches by date lexographically, with the most recent matches first
    this.matches.sort((a, b) => {
      return a.date < b.date ? 1 : -1;
    });
    this.showSpinner = false;
  }

  

}
