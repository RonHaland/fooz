import { RankedPlayer } from "~/_types";

type Props = {
  player: RankedPlayer;
  ind?: number;
  highlightColor?: "yellow" | "purple" | "cyan";
};

export const RankedRow = ({ player, ind, highlightColor }: Props) => {
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
      <td>{player?.rating}</td>
    </tr>
  );
};
