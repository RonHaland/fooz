import { useParams } from "@remix-run/react";
import { LinkButton } from "./LinkButton";

type Props = {
  children?: any;
};

export const TournamentNavBar = ({ children }: Props) => {
  const tournamendId = useParams()["id"];

  return (
    <div className="w-full h-fit flex flex-row justify-between mb-4">
      <div className="flex flex-row">
        <LinkButton href={`/tournament/${tournamendId}`}>
          Back to tournament
        </LinkButton>
      </div>
      <div className="flex flex-row gap-1">{children}</div>
    </div>
  );
};
