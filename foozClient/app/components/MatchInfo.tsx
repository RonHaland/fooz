import { TeamDisplay } from ".";
import type { Match } from "~/_types";

type Props = {
  currentMatch: Match;
};

export const MatchInfo = ({ currentMatch }: Props) => {
  return (
    <div className="flex justify-between my-8 gap-24">
      <TeamDisplay
        team={{
          player1: currentMatch.team1Player1,
          player2: currentMatch.team1Player2,
        }}
        matchId={currentMatch.id}
      />
      <div className="flex flex-col justify-around items-center mt-6 gap-2">
        <span className="h-fit">VS</span>
      </div>
      <TeamDisplay
        team={{
          player1: currentMatch.team2Player1,
          player2: currentMatch.team2Player2,
        }}
        matchId={currentMatch.id}
        align="right"
      />
    </div>
  );
};
