export type RankedPlayer = {
  rating: number;
  name: string;
  id: string;
  modifiedDate: string;
};

export type RankedMatch = {
  id: string;
  modifiedDate: string;
  isCopleted: boolean;
  team1Player1: RankedPlayer;
  team1Player2: RankedPlayer;
  team1Score: number;
  team2Player1: RankedPlayer;
  team2Player2: RankedPlayer;
  team2Score: number;
  players: RankedPlayer[];
};

export type CreateRankedMatchState = {
  randomTeamsList: string[];
  team1List: string[];
  team2List: string[];
  useRandomTeams: boolean;
};
