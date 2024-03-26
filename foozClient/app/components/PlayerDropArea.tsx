import { useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { RankedPlayer } from "~/_types";
import { ItemTypes } from "~/_types/constants";

type props = {
  onDrop?: (item: string, fieldId?: string) => void;
  onRemove?: (id: string) => void;
  allPlayers?: RankedPlayer[];
  playerPool: string[];
  id?: string;
  minH?: string;
};

export const PlayerDropArea = ({
  onDrop = () => {},
  onRemove = () => {},
  allPlayers = [],
  playerPool,
  id,
  minH = "min-h-32",
}: props) => {
  const [internalPlayers, setInternalPlayers] = useState(playerPool);
  const playerMap = Object.assign(
    {},
    ...(allPlayers?.map((p) => ({ [p.id]: p })) ?? [])
  );

  const internalOnDrop = (item: any) => {
    onDrop(item.id, id);
  };

  const [item, drop] = useDrop(
    () => ({
      accept: ItemTypes.PLAYER,
      drop: internalOnDrop,
    }),
    [playerPool, onDrop]
  );

  useEffect(() => {
    setInternalPlayers(playerPool);
  }, [playerPool]);

  var selectedPlayers = useMemo(
    () => (
      <>
        {internalPlayers.map((p, i) => {
          const remove = () => {
            onRemove(p);
          };
          const handleKeyboard = (e: React.KeyboardEvent<HTMLDivElement>) => {
            switch (e.key) {
              case " ":
              case "Enter":
                remove();
            }
          };
          return (
            <div
              key={i}
              className={`bg-sky-900/90 rounded p-2 flex flex-row justify-between`}
            >
              <input type="hidden" name={`player[${i}]`} value={p}></input>
              <span className="">{playerMap[p]?.name}</span>
              <span
                className={`bg-slate-900/20 w-6 text-center rounded-sm select-none
                text-slate-100 font-bold hover:bg-slate-800/20 hover:text-slate-900 hover:cursor-pointer
                focus:outline focus: outline-slate-200`}
                tabIndex={0}
                onClick={remove}
                onKeyDown={handleKeyboard}
                role="button"
              >
                X
              </span>
            </div>
          );
        })}
      </>
    ),
    [internalPlayers]
  );

  return (
    <div
      className={`border-2 border-slate-100 rounded-lg p-4 flex flex-col gap-2 ${minH}`}
      ref={drop}
    >
      {selectedPlayers}
    </div>
  );
};
