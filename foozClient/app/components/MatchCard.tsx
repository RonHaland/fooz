import type { Match } from "~/_types/tournament";

type Props = {
  match: Match;
  roundNumber?: number;
};

export const MatchCard = ({ match, roundNumber = 0 }: Props) => {
  const winningTeam = !match.isCompleted
    ? -1
    : match.team1Score > match.team2Score
    ? 1
    : match.team2Score > match.team1Score
    ? 2
    : 0;

  return (
    <div
      className={`text-slate-800 dark:text-slate-200 rounded ${
        match.isCompleted
          ? "bg-blue-500 dark:bg-sky-900/90"
          : "bg-blue-300 dark:bg-slate-700"
      } flex flex-col w-fit p-2 sm:p-4 divide-y dark:divide-slate-200/20`}
    >
      <a href={`./matches/${match.id}`}>
        <h2 className="text-xl sm:text-2xl">
          Round {match.roundNumber + 1} - Match {match.matchNumber + 1}
        </h2>
      </a>
      <div className="flex flex-row justify-between py-2">
        <div
          className={`flex flex-col p-1 rounded ${getCompletedColor(
            winningTeam,
            1,
            match.team1Score
          )}`}
        >
          <span className="text-sm">{match.team1.player1.name}</span>
          <span className="text-sm">{match.team1.player2.name}</span>
        </div>
        <div className="flex items-center">
          <span className="h-fit">vs</span>
        </div>
        <div
          className={`flex flex-col p-1 rounded ${getCompletedColor(
            winningTeam,
            2,
            match.team2Score
          )}`}
        >
          <span className="text-sm">{match.team2.player1.name}</span>
          <span className="text-sm">{match.team2.player2.name}</span>
        </div>
      </div>
    </div>
  );
};

const getCompletedColor = (
  winningTeam: number,
  myTeam: number,
  score: number
) => {
  let classColors = "";
  const neutralColor = "border-green-400 border bg-green-800/50";
  const winningColor = (score: number) => {
    return score == 1
      ? "border-amber-500 border bg-amber-500/20"
      : neutralColor;
  };
  const losingColor = "border-red-400 border bg-red-800/50";
  switch (winningTeam) {
    case 1:
      classColors = myTeam == 1 ? winningColor(score) : losingColor;
      break;
    case 2:
      classColors = myTeam == 2 ? winningColor(score) : losingColor;
      break;
    case 0:
      classColors = neutralColor;
      break;
    default:
      break;
  }

  return classColors;
};
