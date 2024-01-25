import { Form } from "@remix-run/react";
import type { Match } from "~/_types";
import { getCompletedColor } from "~/utils/colorUtils";
import { ActionButton } from ".";

type Props = {
  match: Match;
};

export const EditMatchModalContent = ({ match }: Props) => {
  const winningTeam = !match.isCompleted
    ? -1
    : match.team1Score > match.team2Score
    ? 1
    : match.team2Score > match.team1Score
    ? 2
    : 0;

  return (
    <div className="flex flex-col text-slate-100">
      <h3 className="">Edit Match {(match.order ?? 0) + 1}</h3>
      <div className="flex flex-row justify-between py-2">
        <div
          className={`flex flex-col p-1 rounded ${getCompletedColor(
            winningTeam,
            1,
            match.team1Score
          )}`}
        >
          <span className="text-sm">{match.team1Player1.name}</span>
          <span className="text-sm">{match.team1Player2.name}</span>
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
          <span className="text-sm">{match.team2Player1.name}</span>
          <span className="text-sm">{match.team2Player2.name}</span>
        </div>
      </div>
      <div className="w-fit grid grid-cols-5 text-center text-lg text-slate-100 p-4 gap-2">
        <h3 className="col-span-2">Team 1</h3>
        <h3 className="col-span-2 col-start-4">Team 2</h3>
        <div className="col-start-1">
          <Form
            method="POST"
            action={`./?type=score&teamId=${1}&matchId=${match.id}`}
          >
            <ActionButton submit colorCode="Success">
              Score Win
            </ActionButton>
          </Form>
        </div>
        <div className="col-start-2">
          <Form
            method="POST"
            action={`./?type=time&teamId=${1}&matchId=${match.id}`}
          >
            <ActionButton submit colorCode="Secondary">
              Time Win
            </ActionButton>
          </Form>
        </div>

        <div className="col-start-3">
          <Form method="POST" action={`./?type=draw&matchId=${match.id}`}>
            <ActionButton submit colorCode="Secondary">
              Draw
            </ActionButton>
          </Form>
        </div>
        <div className="col-start-4">
          <Form
            method="POST"
            action={`./?type=time&teamId=${2}&matchId=${match.id}`}
          >
            <ActionButton submit colorCode="Secondary">
              Time Win
            </ActionButton>
          </Form>
        </div>

        <div className="col-start-5">
          <Form
            method="POST"
            action={`./?type=score&teamId=${2}&matchId=${match.id}`}
          >
            <ActionButton submit colorCode="Success">
              Score Win
            </ActionButton>
          </Form>
        </div>
      </div>
    </div>
  );
};
