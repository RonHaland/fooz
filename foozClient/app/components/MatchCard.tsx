import type { Match } from "~/_types/tournament";
import { getCompletedColor } from "~/utils/colorUtils";

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
      className={`text-slate-800 dark:text-slate-200 w-72 rounded ${
        match.isCompleted
          ? "bg-blue-500 dark:bg-sky-900/90"
          : "bg-blue-300 dark:bg-slate-700"
      } flex flex-col p-2 sm:p-4 divide-y dark:divide-slate-200/20`}
    >
      <a href={`./matches/${match.id}`}>
        <h2 className="text-xl sm:text-2xl">Match {match.order + 1}</h2>
      </a>
      <div className="flex flex-row justify-between py-2">
        <div
          className={`flex flex-col p-1 overflow-hidden rounded w-[40%] whitespace-nowrap ${getCompletedColor(
            winningTeam,
            1,
            match.team1Score
          )}`}
        >
          <span className="text-sm overflow-hidden text-ellipsis">
            {match.team1Player1.name}
          </span>
          <span className="text-sm overflow-hidden text-ellipsis">
            {match.team1Player2.name}
          </span>
        </div>
        <div className="flex items-center">
          <span className="h-fit">vs</span>
        </div>
        <div
          className={`flex flex-col p-1 overflow-hidden rounded w-[40%] whitespace-nowrap text-right ${getCompletedColor(
            winningTeam,
            2,
            match.team2Score
          )}`}
        >
          <span className="text-sm overflow-hidden text-ellipsis">
            {match.team2Player1.name}
          </span>
          <span className="text-sm overflow-hidden text-ellipsis">
            {match.team2Player2.name}
          </span>
        </div>
      </div>
    </div>
  );
};
