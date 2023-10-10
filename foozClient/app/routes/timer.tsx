import { PrimaryButton } from "~/components/PrimaryButton";
import { useTimer } from "~/hooks/useTimer";

const MAX_TIME = 5;

const Timer = () => {
  const {
    timeLeft: time,
    isStarted: started,
    isPaused: paused,
    toggleStarted,
    togglePause,
  } = useTimer(MAX_TIME);

  return (
    <div className={"h-screen w-screen"}>
      <div className="flex justify-center h-full">
        <div className={"flex flex-col justify-center text-center"}>
          <h1 className="font-bold text-2xl">
            {time < 0 ? "OVERTIMER:" : "TIMER:"}
          </h1>
          <h2 className="text-lg">
            {time < 0 ? (time + 120).toFixed(0) : time.toFixed(0)}
          </h2>
          <div className="flex justify-between gap-4">
            <PrimaryButton
              type="button"
              onClick={toggleStarted}
              buttonText={started ? "Stop" : "Start"}
            ></PrimaryButton>

            <PrimaryButton
              buttonText={paused ? "Resume" : "Pause"}
              onClick={togglePause}
              disabled={!started}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
