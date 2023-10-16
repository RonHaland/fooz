import { useParams } from "@remix-run/react";
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
    <a key={m.id} href={`/tournament/${tournamentId}/matches/${m.id}`}>
      Match {m.matchNumber + 1}
    </a>
  ));

  let className = "bg-slate-200 dark:bg-slate-700";
  if (round.isCompleted) {
    className = "bg-lime-200 dark:bg-emerald-900";
  }
  return (
    <div className={`rounded p-4 ${className} h-fit`}>
      <button onClick={toggleOpen}>Round {round.roundNumber + 1}</button>
      {isOpen && <div className="flex flex-col">{matches}</div>}
    </div>
  );
};
