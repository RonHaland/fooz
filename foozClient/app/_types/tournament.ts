export type Tournament = {
  id: string;
  name: string;
  isCompleted: boolean;
  participants: Player[];
  rounds: Round[];
};

export type League = {
  id: string;
  name: string;
  isCompleted: boolean;
  players: Player[];
  matches: Match[];
};

export type LeagueListItem = {
  name: string;
  id: string;
  time: Date;
  matchCount: number;
  playerCount: number;
};

export type Round = {
  roundNumber: number;
  isCompleted: boolean;
  matches: Match[];
  teams: Team[];
};

export type Match = {
  id: string;
  order: number;
  isCompleted: boolean;
  team1Player1: Player;
  team1Player2: Player;
  team2Player1: Player;
  team2Player2: Player;
  team1Score: number;
  team2Score: number;
};

export type Team = {
  player1: Player;
  player2: Player;
  score?: number;
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

export type LeagueProgress = {
  currentMatch?: Match;
  completedMatches?: Match[];
  upcomingMatches?: Match[];
};

export type PutMatch = {
  winningTeam: number;
  winType: WinType;
};

export type WinType = "draw" | "time" | "score";
