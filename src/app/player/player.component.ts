import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {

  playerId: string | undefined;
  player: any;
  showSpinner = true;
  constructor(private firebaseService: FirebaseService) { }

  async ngOnInit(): Promise<void> {
    // get the id that was passed in the URL
    this.playerId = window.location.href.split('/').pop();
    if (!this.playerId) {
      console.error('Player ID not found in URL');
      return;
    }

    this.player = await this.firebaseService.getUserInfo(this.playerId);
    console.log(this.player);
    this.showSpinner = false;

  }



}
