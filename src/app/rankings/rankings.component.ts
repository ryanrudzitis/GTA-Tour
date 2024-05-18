import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent {

  showSpinner = true;
  allPlayers: any[] = [];
  displayedColumns: string[] = ['rank', 'name', 'points'];

  constructor(private firebaseService: FirebaseService) { }

  async ngOnInit(): Promise<void> {
    this.allPlayers = await this.firebaseService.getAllPlayers();
    // sort players by points
    this.allPlayers.sort((a, b) => b.points - a.points);
    console.log(this.allPlayers);
    this.showSpinner = false;
  }
}
