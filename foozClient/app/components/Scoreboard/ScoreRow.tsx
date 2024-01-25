import type { Player } from "~/_types/tournament";

type Props = {
  player?: Player;
  ind?: number;
  highlightColor?: "yellow" | "purple" | "cyan";
};

export const ScoreRow = ({ player, ind, highlightColor }: Props) => {
  return (
    <tr
      className={`border-b border-slate-100/20 text-center ${
        highlightColor == "yellow"
          ? "bg-yellow-300/20"
          : highlightColor == "purple"
          ? "bg-fuchsia-400/20"
          : highlightColor == "cyan"
          ? "bg-cyan-400/20"
          : ""
      }`}
    >
      <td>{ind}</td>
      <td>{player?.name}</td>
      <td>{player?.score}</td>
      <td>
        {player?.matchesPlayed}/{player?.matchCount}
      </td>
    </tr>
  );
};
