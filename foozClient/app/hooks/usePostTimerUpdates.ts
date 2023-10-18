import { useEffect, useState } from "react";

export const usePostTimerUpdates = (apiUrl: string, tournamentId: string) => {
  const [update, setUpdate] = useState<PostTimerUpdate | undefined>();
  
  useEffect(() => {
    const sendUpdate = async () => {
    if (update){
      const result = await fetch(`${apiUrl}/Tournament/${tournamentId}/live/timer`, {method: "PUT", headers: { "Content-Type": 'application/json'}, body: JSON.stringify(update)})

      console.log(result);
      setUpdate(undefined);
    }}
    sendUpdate();
  }, [update, setUpdate, apiUrl, tournamentId]);
  return { update, setUpdate }
}

type PostTimerUpdate = {
  timerUpdate: TimerUpdate,
  amount?: number
}
type TimerUpdate = "Start" | "Stop" | "Pause" | "Unpause" | "Edit" | "EditOvertime"