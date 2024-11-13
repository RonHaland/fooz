import { useEffect, useState } from "react";

export const useTimer = (initalSeconds: number) => {
  const [seconds, setSeconds] = useState(initalSeconds);
  const [time, setTime] = useState(initalSeconds);
  const [pauseTime, setPauseTime] = useState(0);
  const [passedTime, setPassedTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [intervalId, setIntervalId] = useState<number>(-1);
  const [pauseIntervalId, setPauseIntervalId] = useState<number>(-1);

  const toggleStarted = () => {
    setStarted(!started);
    if (started) {
      setPaused(false);
      setPauseTime(0);
    }
  };
  const togglePause = () => {
    setPaused(!paused);
  };
  const setSecondsInner = (seconds: number) => {
    setSeconds(seconds);
    setTime(seconds);
  };

  useEffect(() => {
    if (paused) {
      const pausedAt = new Date();
      if (pauseTime > 0) {
        pausedAt.setTime(pausedAt.getTime() - pauseTime * 1000);
      }

      const id = setInterval(() => {
        const now = new Date();
        const diff = Math.abs(pausedAt.getTime() - now.getTime()) / 1000;
        setPauseTime(diff);
      }, 50);

      setPauseIntervalId(id as unknown as number);
    } else {
      clearInterval(pauseIntervalId);
      setPauseIntervalId(-1);
    }

    return () => {
      clearInterval(pauseIntervalId);
      setPauseIntervalId(-1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  useEffect(() => {
    setTime(seconds + pauseTime - passedTime);
  }, [passedTime, pauseTime, seconds]);

  useEffect(() => {
    if (started) {
      const startedAt = new Date();
      const id = setInterval(() => {
        const now = new Date();
        const diff = Math.abs(startedAt.getTime() - now.getTime()) / 1000;
        setPassedTime(diff);
      }, 50);
      setIntervalId(id as unknown as number);
    } else {
      clearInterval(intervalId);
      setIntervalId(-1);
      setTime(seconds);
    }

    return () => {
      clearInterval(intervalId);
      setIntervalId(-1);
      setTime(seconds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return {
    timeLeft: time,
    timePaused: pauseTime,
    toggleStarted,
    togglePause,
    setSeconds: setSecondsInner,
    isStarted: started,
    isPaused: paused,
  };
};
