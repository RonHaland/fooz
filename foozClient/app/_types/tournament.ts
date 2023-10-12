export type Tournament = {

}

export type Match = {
  id: string;
  roundId: string;
  matchNumber: number;
  roundNumber: number;
  isCompleted: boolean;
  team1: Team;
  team2: Team;
  team1Score: number;
  team2Score: number;
}

export type Team = {
  id: string;
  player1: Player;
  player2: Player;
  score: number;
}

export type Player = {
  id: string;
  name: string;
  score: 0;
}

export type CurrentMatch = {
  currentMatch: Match;
  previousMatch?: Match;
  nextMatch?: Match;
}