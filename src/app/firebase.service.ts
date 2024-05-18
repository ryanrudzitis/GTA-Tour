import { Injectable } from '@angular/core';
import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Tournament {
  name: string;
  location: string;
  level: string;
}

@Injectable({
  providedIn: 'root',
})

export class FirebaseService {
  constructor() {}

  async getUserName(userId: string): Promise<string> {
    const db = getFirestore();
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();
    if (!userData) {
      return '';
    } else {
      return `${userData['firstName']} ${userData['lastName']}`;
    }
  }

  /**
   * Get user information from the database
   * @param {string} userId - The id of the user
   * @returns {Promise<any>} - The user information which includes first name, last name, and email
   */
  async getUserInfo(userId: string): Promise<any> {
    const db = getFirestore();
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  }

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

  async getAllTournaments(): Promise<any> {
    const db = getFirestore();
    const tournamentsCollection = collection(db, 'tournaments');
    const tournamentsSnapshot = await getDocs(tournamentsCollection);
    const tournaments = tournamentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as Tournament }));
    // sort tournaments by name
    tournaments.sort((a, b) => a.name.localeCompare(b.name));
    // put tournament with name "League Match" at the front
    const leagueMatches = tournaments.find(tournament => tournament.name === "League Match");
    if (leagueMatches) {
      tournaments.splice(tournaments.indexOf(leagueMatches), 1);
      tournaments.unshift(leagueMatches);
    }
    return tournaments;
  }


  //TODO: function may be redundant
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

  async getTournamentName(tournamentId: string): Promise<string> {
    const db = getFirestore();
    const tournamentDoc = doc(db, 'tournaments', tournamentId);
    const tournamentSnap = await getDoc(tournamentDoc);
    const tournamentData = tournamentSnap.data();
    if (tournamentData) {
      return tournamentData['name'];
    } else {
      return '';
    }
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
          match.tournamentId = tournamentId;
          playerMatches.push(match);
        }
      }
    }
    return playerMatches;
  }

  /**
   * Get all players from the database
   * @returns {Promise<any>} - Array of all players
   */
  async getAllPlayers(): Promise<any> {
    const db = getFirestore();
    const playersCollection = collection(db, 'users');
    const playersSnapshot = await getDocs(playersCollection);
    const players = playersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
    return players;
  }

  async addMatch(matchInfo: any): Promise<void> {
    console.log("adding match to db");
    console.log(matchInfo);

    const formatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    
    let localeString = matchInfo.date.toLocaleDateString('en-US', formatOptions);
    // remove second comma from date
    localeString = localeString.replace(/,(?=[^,]*$)/, '');
    const isoString = this.toIsoString(matchInfo.date);

    const db = getFirestore();
    const matchCollection = collection(db, 'tournaments', matchInfo.tournament.id, 'matches');
    try {
      await setDoc(doc(matchCollection), {
        winner_id: matchInfo.winner,
        loser_id: matchInfo.loser,
        date: isoString,
        localeDate: localeString,
        round: matchInfo.round,
        set1: matchInfo.set1,
        set2: matchInfo.set2,
        set3: matchInfo.set3,
        status: matchInfo.status,
      });
      console.log("Document successfully written!");
      await this.incrementWins(matchInfo.winner);
      await this.incrementLosses(matchInfo.loser);
      await this.incrementPoints(matchInfo.winner, 50);
      console.log("Wins and losses incremented");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }

  /**
   * Convert a date object to an ISO string based on the local timezone
   * https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
   */
  toIsoString(date: Date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num: any) {
            return (num < 10 ? '0' : '') + num;
        };
  
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) 
        // +
        // dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        // ':' + pad(Math.abs(tzo) % 60)
        ;
  }

  async incrementWins(playerId: string): Promise<void> {
    const db = getFirestore();
    const userDoc = doc(db, 'users', playerId);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();
    if (userData) {
      const wins = userData['wins'] + 1;
      await setDoc(userDoc, { wins: wins }, { merge: true });
    }
  }
  async incrementLosses(playerId: string): Promise<void> {
    const db = getFirestore();
    const userDoc = doc(db, 'users', playerId);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();
    if (userData) {
      const losses = userData['losses'] + 1;
      await setDoc(userDoc, { losses: losses }, { merge: true });
    }
  }

  async incrementPoints(playerId: string, points: number): Promise<void> {
    const db = getFirestore();
    const userDoc = doc(db, 'users', playerId);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();
    if (userData) {
      const newPoints = userData['points'] + points;
      await setDoc(userDoc, { points: newPoints }, { merge: true });
    }
  }
}

