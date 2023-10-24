export type Tournament = {
  id: string;
  name: string;
  isCompleted: boolean;
  participants: Player[];
  rounds: Round[];
};

export type TournamentListItem = {
  name: string;
  id: string;
  time: Date;
};

export type Round = {
  roundNumber: number;
  isCompleted: boolean;
  matches: Match[];
  teams: Team[];
};

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
};

export type Team = {
  id: string;
  player1: Player;
  player2: Player;
  score: number;
};

export type Player = {
  id: string;
  name: string;
  score: 0;
  matchCount: number;
  matchesPlayed: number;
};

export type CurrentMatch = {
  currentMatch?: Match;
  previousMatch?: Match;
  nextMatch?: Match;
  isCompleted: boolean;
};

export type PutMatch = {
  winningTeam: number;
  winType: WinType;
};

export type WinType = "draw" | "time" | "score";
