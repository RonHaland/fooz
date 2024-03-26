import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { RankedPlayer } from "~/_types";
import { ItemTypes } from "~/_types/constants";

type props = {
  player: RankedPlayer;
  onAddPlayer?: (id: string) => void;
};
let isHydrating = true;
export const DraggablePlayer = ({ player, onAddPlayer = () => {} }: props) => {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);
  const [{ className }, dragref] = useDrag(
    () => ({
      type: ItemTypes.PLAYER,
      item: { id: player.id },
      collect: (m) => ({
        className: m.isDragging() ? "bg-sky-900/50" : "bg-sky-900",
      }),
    }),
    []
  );

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  const handleAddPlayer = () => {
    onAddPlayer(player.id);
  };
  const handleKeyboardAdd = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case " ":
      case "Enter":
        onAddPlayer(player.id);
    }
  };

  const playerInfoCard = (
    <div
      className={`${className} p-2 rounded-lg hover:cursor-pointer text-slate-100 flex flex-row justify-between`}
    >
      <span>{player.name}</span>{" "}
      <span
        className={`bg-slate-900/20 w-6 text-center leading-tight 
        rounded-sm text-slate-100 font-bold 
        hover:bg-slate-800/20 hover:text-slate-900 hover:cursor-pointer
        focus:outline focus:outline-slate-100`}
        onClick={handleAddPlayer}
        onKeyDown={handleKeyboardAdd}
        tabIndex={0}
        role="button"
      >
        +
      </span>
    </div>
  );
  if (isHydrated) return <div ref={dragref}>{playerInfoCard}</div>;
  else return <div>{playerInfoCard}</div>;
};
