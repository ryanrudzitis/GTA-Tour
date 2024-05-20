import { Injectable } from '@angular/core';
import { POINTS_LOOKUP } from 'src/points-lookup';

@Injectable({
  providedIn: 'root'
})
export class PointsService {

  constructor() { }

  getPoints(level: string, round: string): number {
    console.log("level: ", level);
    console.log("round: ", round);
    const tournamentPoints = POINTS_LOOKUP[level];
    return tournamentPoints[round];
  }

}
