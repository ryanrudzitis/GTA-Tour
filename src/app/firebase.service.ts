import { Injectable } from '@angular/core';
import { doc, getDoc, getFirestore } from '@firebase/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}

  /**
   * Get all matches in a tournament
   * @param {string} tournamentId - The id of the tournament
   * @returns {Promise<any>} - Array of matches in the tournament
   */
  async getMatchesInTournament(tournamentId: string): Promise<any> {
    const db = getFirestore();
    const matchesCollection = collection(
      db,
      'tournaments',
      tournamentId,
      'matches'
    );
    const matchesSnapshot = await getDocs(matchesCollection);
    const matches = matchesSnapshot.docs.map((doc) => doc.data());
    return matches;
  }

  /**
   * Get all tournament ids from the database
   * @returns {Promise<string[]>} - Array of tournament ids
   */
  async getAllTournamentIds(): Promise<string[]> {
    const db = getFirestore();
    const tournamentsCollection = collection(db, 'tournaments');
    const tournamentIds: string[] = [];

    const tournamentSnapshot = await getDocs(tournamentsCollection);
    tournamentSnapshot.forEach((doc) => {
      tournamentIds.push(doc.id);
    });

    return tournamentIds;
  }

  /**
   * Check if a player is in a match
   * @param {string} playerId - The id of the player
   * @param {any} match - The match object
   * @returns {boolean} - True if the player is in the match, false otherwise
   */
  isPlayerInMatch(playerId: string, match: any): boolean {
    console.log('playerId:', playerId);
    console.log('match:', match.player1.id);

    if (match.player1.id === playerId || match.player2.id === playerId) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get all matches for a player
   * @param {string} playerId - The id of the player
   * @returns {Promise<any>} - Array of matches for the player
   */
  async getMatchesForPlayer(playerId: string): Promise<any> {
    const playerMatches = [];
    const tournamentIds = await this.getAllTournamentIds();
    for (const tournamentId of tournamentIds) {
      const matches = await this.getMatchesInTournament(tournamentId);
      console.log('matches for tourney:', matches);
      for (const match of matches) {
        console.log('match here:', match);

        if (this.isPlayerInMatch(playerId, match)) {
          console.log('match!!!!!!:', match);
          playerMatches.push(match);
        }
      }
    }
    return playerMatches;
  }
}
