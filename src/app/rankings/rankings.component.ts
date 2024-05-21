import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { flag, code, name, countries } from 'country-emoji';


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

  /**
   * Get the flag emoji for a country
   * @param country The country name
   * @returns The flag emoji for the country
   */
  getFlag(country: string): string | undefined {
    return flag(country);
  }
}
