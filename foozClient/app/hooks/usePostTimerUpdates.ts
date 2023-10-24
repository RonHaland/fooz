import { useEffect, useState } from "react";

export const usePostTimerUpdates = (tournamentId: string) => {
  const [update, setUpdate] = useState<PostTimerUpdate | undefined>();

  useEffect(() => {
    const sendUpdate = async () => {
      if (update) {
        await fetch(`/api/timer/${tournamentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        });
        setUpdate(undefined);
      }
    };
    sendUpdate();
  }, [update, setUpdate, tournamentId]);

  return { update, setUpdate };
};

type PostTimerUpdate = {
  timerUpdate: TimerUpdate;
  amount?: number;
};
type TimerUpdate =
  | "Start"
  | "Stop"
  | "Pause"
  | "Unpause"
  | "Edit"
  | "EditOvertime";
