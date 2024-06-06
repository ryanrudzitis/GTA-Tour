import { Injectable } from '@angular/core';
import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore';
import { collection, getDocs, query, where, or } from 'firebase/firestore';
import { PointsService } from './points.service';

interface Tournament {
  name: string;
  location: string;
  level: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private db = getFirestore();

  constructor(private pointsService: PointsService) {
  }

  async getUserName(userId: string): Promise<string> {
    const userDoc = doc(this.db, 'users', userId);
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
    const userDoc = doc(this.db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  }

  async getMatchesForUser(userId: string): Promise<any> {
    const matchesCollection = collection(this.db, 'matches');
    const matchesQuery = query(matchesCollection, or(where('winner', '==', userId), where('loser', '==', userId)));
    const matchesSnapshot = await getDocs(matchesQuery);
    const matches = matchesSnapshot.docs.map((doc) => doc.data());
    //sort matches by date lexographically, with most recent first
    matches.sort((a, b) => b['date'].localeCompare(a['date']));
    return matches;
  }

  /**
   * Get all matches in a tournament
   * @param {string} tournamentId - The id of the tournament
   * @returns {Promise<any>} - Array of matches in the tournament
   * 
   */
  //TODO - can this be deleted?
  async getMatchesInTournament(tournamentId: string): Promise<any> {
    const matchesCollection = collection(
      this.db,
      'tournaments',
      tournamentId,
      'matches'
    );
    const matchesSnapshot = await getDocs(matchesCollection);
    const matches = matchesSnapshot.docs.map((doc) => doc.data());
    return matches;
  }

  async getAllTournaments(): Promise<any> {
    const tournamentsCollection = collection(this.db, 'tournaments');
    const tournamentsSnapshot = await getDocs(tournamentsCollection);
    const tournaments = tournamentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Tournament),
    }));
    // sort tournaments by name
    tournaments.sort((a, b) => a.name.localeCompare(b.name));
    // put tournament with name "League Match" at the front
    const leagueMatches = tournaments.find(
      (tournament) => tournament.name === 'League Match'
    );
    if (leagueMatches) {
      tournaments.splice(tournaments.indexOf(leagueMatches), 1);
      tournaments.unshift(leagueMatches);
    }
    return tournaments;
  }

  async getAllMatches(): Promise<any> {
    const matchesCollection = collection(this.db, 'matches');
    const matchesSnapshot = await getDocs(matchesCollection);
    const matches = matchesSnapshot.docs.map((doc) => doc.data());
    return matches;
  }

  //TODO: function may be redundant
  /**
   * Get all tournament ids from the database
   * @returns {Promise<string[]>} - Array of tournament ids
   */
  async getAllTournamentIds(): Promise<string[]> {
    const tournamentsCollection = collection(this.db, 'tournaments');
    const tournamentIds: string[] = [];

    const tournamentSnapshot = await getDocs(tournamentsCollection);
    tournamentSnapshot.forEach((doc) => {
      tournamentIds.push(doc.id);
    });

    return tournamentIds;
  }

  async getTournamentName(tournamentId: string): Promise<string> {
    const tournamentDoc = doc(this.db, 'tournaments', tournamentId);
    const tournamentSnap = await getDoc(tournamentDoc);
    const tournamentData = tournamentSnap.data();
    if (tournamentData) {
      return tournamentData['name'];
    } else {
      return '';
    }
  }

  async getPlayerName(playerId: string): Promise<string> {
    const playerDoc = doc(this.db, 'users', playerId);
    const playerSnap = await getDoc(playerDoc);
    const playerData = playerSnap.data();
    if (playerData) {
      return `${playerData['firstName']} ${playerData['lastName']}`;
    } else {
      return '';
    }
  }

  /**
   * Get all players from the database
   * @returns {Promise<any>} - Array of all players
   */
  async getAllPlayers(): Promise<any> {
    const playersCollection = collection(this.db, 'users');
    const playersSnapshot = await getDocs(playersCollection);
    const players = playersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return players;
  }

  /**
   * Add a match to the database
   * @param {any} matchInfo - The match information
   * @returns {void}
   */
  async addMatch(matchInfo: any): Promise<void> {
    console.log(matchInfo);

    const formatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    let localeString = matchInfo.date.toLocaleDateString(
      'en-US',
      formatOptions
    );
    // remove second comma from date
    localeString = localeString.replace(/,(?=[^,]*$)/, '');

    const isoString = this.toIsoString(matchInfo.date);
    const matchesCollection = collection(this.db, 'matches');
    
    let round;
    if (matchInfo.round === undefined) {
      // league matches don't have rounds
      round = {
        name: 'League Match',
        value: 'lm',
      };
    } else {
      round = {
        name: matchInfo.round.name,
        value: matchInfo.round.value,
      };
    }

    const { winner, loser, set1, set2, set3, status, tournament } = matchInfo;

    try {
      await setDoc(doc(matchesCollection), {
        winner: winner,
        loser: loser,
        date: isoString,
        dateString: localeString,
        tournament: tournament.id,
        round: round,
        set1: set1,
        set2: set2,
        set3: set3,
        status: status,
      });
      console.log('Document successfully written!');
      await this.incrementField(winner, 'wins');
      await this.incrementField(loser, 'losses');
      await this.incrementPoints(
        winner,
        loser,
        tournament.level.value,
        round.value
      );
      console.log('Wins and losses incremented');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  /**
   * Convert a date object to an ISO string based on the local timezone
   * https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
   */
  toIsoString(date: Date) {
    var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num: any) {
        return (num < 10 ? '0' : '') + num;
      };

    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds())
      // +
      // dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      // ':' + pad(Math.abs(tzo) % 60)
    );
  }

  /**
   * Increment a field in the user document, either wins or losses
   * @param {string} playerId - The id of the player
   * @param {string} field - The field to increment, either 'wins' or 'losses'
   * @returns {void}
   */
  async incrementField(playerId: string, field: string): Promise<void> {
    const userDoc = doc(this.db, 'users', playerId);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();
    if (userData) {
      const newField = userData[field] + 1;
      await setDoc(userDoc, { [field]: newField }, { merge: true });
    }
  }

  /**
   * Increment points for a match
   * @param {string} winnerId - The id of the winner
   * @param {string} loserId - The id of the loser
   * @param {string} tournamentLevel - The level of the tournament
   * @param {string} matchLevel - The level of the match
   * @returns {void}
   * 
   */
  async incrementPoints(
    winnerId: string,
    loserId: string,
    tournamentLevel: string,
    matchLevel: string
  ): Promise<void> {
    const points = this.pointsService.getPoints(tournamentLevel, matchLevel);
    if (tournamentLevel === 'lm') { // league match
      await this.leagueMatchPoints(winnerId, loserId, points);
      return;
    } else {
      for (const id of [winnerId, loserId]) {
        await this.updateUserPoints(id, points);
      }

      if (matchLevel === 'f') {
        console.log("need to add winner points for winning the final");
        const winnerPoints = this.pointsService.getPoints(tournamentLevel, 'w');
        await this.updateUserPoints(winnerId, winnerPoints);
      }
    }
  }

  /**
   * Increment points for a league match. Has to be done separately because unlike tournaments, losers lose points
   * @param {string} winnerId - The id of the winner
   * @param {string} loserId - The id of the loser
   * @param {number} winnerPoints - The number of points the winner gets
   * @returns {void}
   * 
   */
  async leagueMatchPoints(winnerId: string, loserId: string, winnerPoints: number): Promise<void> {
    const loserPoints = -10;
    this.updateUserPoints(winnerId, winnerPoints);
    this.updateUserPoints(loserId, loserPoints);
  }

  /**
   * Update the points of a user, by specifiying how many points to add
   * @param {string} userId - The id of the user
   * @param {number} pointsToAdd - The number of points to add
   * @returns {void}
   * 
   */
  private async updateUserPoints(userId: string, pointsToAdd: number): Promise<void> {
    const userDoc = doc(this.db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    const userData = userSnap.data();
    if (userData) {
      const newPoints = userData['points'] + pointsToAdd;
      await setDoc(userDoc, { points: newPoints }, { merge: true });
    } else {
      console.error(`User with ID ${userId} not found`);
    }
  }

  async updateUserInfo(userId: string, info: any): Promise<void> {
    const userDoc = doc(this.db, 'users', userId);
    await setDoc(userDoc, info, { merge: true });
  }

  

  
}
