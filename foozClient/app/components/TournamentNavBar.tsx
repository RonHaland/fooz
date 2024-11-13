import { useParams } from "@remix-run/react";
import { LinkButton } from "./LinkButton";

type Props = {
  children?:
    | (JSX.Element | string | undefined | false)[]
    | JSX.Element
    | string
    | undefined;
};

export const TournamentNavBar = ({ children }: Props) => {
  const tournamendId = useParams()["id"];

  return (
    <div className="w-full h-fit flex flex-row justify-between mb-4 gap-1">
      <div className="flex flex-row">
        <LinkButton href={`/league/${tournamendId}`}>
          Back to tournament
        </LinkButton>
      </div>
      <div className="flex flex-row gap-1 flex-grow justify-end">
        {children}
      </div>
    </div>
  );
};
