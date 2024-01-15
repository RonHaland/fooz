import { Link, useParams } from "@remix-run/react";
import { useState } from "react";
import type { Round } from "~/_types/tournament";

type Props = {
  round: Round;
};

export const RoundAccordion = ({ round }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const { id: tournamentId } = useParams();

  const matches = round.matches.map((m) => (
    <Link
      key={m.id}
      to={`/tournament/${tournamentId}/matches/${m.id}`}
      className="hover:bg-slate-950/20 w-full text-center py-1"
    >
      Match {m.matchNumber + 1}
    </Link>
  ));

  let className = "bg-slate-200 dark:bg-slate-700";
  let bgClass = "bg-slate-200 dark:bg-slate-700";
  if (round.isCompleted) {
    className =
      "bg-lime-200 dark:from-lime-700 dark:to-lime-800 hover:dark:to-lime-900 bg-gradient-to-t";
    bgClass = "bg-lime-200 dark:bg-lime-700";
  }
  return (
    <div
      className={`rounded text-slate-200 ${className} h-fit relative border border-slate-100/10`}
    >
      <button onClick={toggleOpen} className="h-full py-4 w-24 ">
        Round {round.roundNumber + 1}
      </button>
      {isOpen && (
        <div
          className={`absolute top-full -mt-1 z-10 rounded left-0 right-0 py-2 
                      border border-slate-100/10 border-t-0 rounded-tl-none 
                      rounded-tr-none -mx-[1px] max-h-64 overflow-y-auto ${bgClass}`}
        >
          <div className="flex flex-col items-center">{matches}</div>
        </div>
      )}
    </div>
  );
};
