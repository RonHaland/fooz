import type { Team } from "~/_types";

export const TeamDisplay = ({
  team,
  align = "left",
  matchId,
}: {
  team?: Team;
  align?: "left" | "right";
  matchId?: string;
}) => {
  const leftAligned = align == "left";
  return (
    <div className="flex flex-row items-center gap-4">
      <div className={`order-2 ${leftAligned ? `text-left` : "text-right"}`}>
        {!!team && (
          <>
            <h3 className="text-lg">{team.player1.name}</h3>
            <h3 className="text-lg">{team.player2.name}</h3>
          </>
        )}
      </div>
      <div
        className={`${
          leftAligned ? "order-1 items-end" : "order-3"
        } flex flex-col gap-2`}
      ></div>
    </div>
  );
};
