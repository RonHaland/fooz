import { useEffect, useRef, useState } from "react";

export const usePostDonut = (tournamentId: string) => {
  const [donut, setDonut] = useState(false);
  const isSendingRef = useRef(false);

  useEffect(() => {
    if (!donut || isSendingRef.current) {
      return;
    }

    const sendDonut = async () => {
      isSendingRef.current = true;
      try {
        await fetch(`/api/donut/${tournamentId}`, {
          method: "POST",
        });
      } finally {
        isSendingRef.current = false;
        setDonut(false);
      }
    };

    sendDonut();
  }, [donut, tournamentId]);

  return { donut, setDonut };
};
