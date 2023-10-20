import type { Player } from "~/_types/tournament";

type Props = {
  player?: Player;
  ind?: number;
};

export const ScoreRow = ({ player, ind }: Props) => {
  return (
    <tr className="border-b border-slate-100/20 text-center">
      <td>{ind}</td>
      <td>{player?.name}</td>
      <td>{player?.score}</td>
      <td>
        {player?.matchesPlayed}/{player?.matchCount}
      </td>
    </tr>
  );
};
