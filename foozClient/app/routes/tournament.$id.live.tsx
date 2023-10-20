import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { CurrentMatch, Tournament } from "~/_types/tournament";
import { MatchCard, Scoreboard, TeamDisplay } from "~/components";
import { ScoreRow } from "~/components/Scoreboard/ScoreRow";
import { useTimer } from "~/hooks";
import { useWebSocket } from "~/hooks/useWebSocket";

const LivePage = () => {
  const { wsConnectionEndpoint, tournament, currentMatch } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { connect, setOnMessage } = useWebSocket(wsConnectionEndpoint);
  const {
    timeLeft,
    setSeconds,
    isPaused,
    togglePause,
    isStarted,
    toggleStarted,
  } = useTimer(360);
  const [timerUpdate, setTimerUpdate] = useState<{
    update: string;
    amount: string;
  } | null>(null);

  const players = tournament?.participants
    .sort((a, b) => b.score - a.score)
    .map((p, i) => <ScoreRow key={p.id} player={p} ind={i + 1} />);

  useEffect(
    function handleTimerUpdate() {
      if (timerUpdate) {
        const { update, amount } = timerUpdate;
        console.log("TIMER UPDATING: " + update);

        switch (update) {
          case "Start":
            if (!isStarted) {
              toggleStarted();
            }
            break;
          case "Stop":
            if (isStarted) {
              toggleStarted();
            }
            break;
          case "Pause":
            if (!isPaused) {
              togglePause();
            }
            break;
          case "Unpause":
            if (isPaused) {
              togglePause();
            }
            break;
          case "Edit":
            setSeconds(Number.parseInt(amount));
            break;
          case "EditOvertime":
          default:
            console.log(update);
            break;
        }

        setTimerUpdate(null);
      }
    },
    [timerUpdate]
  );

  useEffect(function connectWebSocket() {
    connect();
    const onMessage = (e: string) => {
      const parts = e.split(":");
      const keyword = parts[0];
      switch (keyword) {
        case "update":
          navigate(".");
          break;
        case "timer":
          setTimerUpdate({ update: parts[1], amount: parts[2] });
          break;
        default:
          console.log("unkown message: " + e);
          break;
      }
    };

    setOnMessage(() => onMessage);
  }, []);

  return (
    <div className="container mx-auto pt-20 h-full">
      <div className="flex flex-col text-slate-200">
        <h1 className="text-4xl text-center font-semibold">
          {tournament?.name}
        </h1>
        <h2 className="text-2xl text-center">
          ROUND {(currentMatch?.currentMatch.roundNumber ?? 0) + 1} - MATCH{" "}
          {(currentMatch?.currentMatch.matchNumber ?? 0) + 1}
        </h2>
        <div className="grid grid-cols-2 grid-row-5 md:grid-cols-3 mt-16 gap-8">
          <div className="p-4 rounded bg-slate-800 border border-slate-200/20 h-fit row-span-2 row-start-4 col-start-1 md:row-start-1 col-span-2 md:col-span-1">
            <h2 className="text-center text-lg">Scores</h2>
            <Scoreboard>{players}</Scoreboard>
          </div>
          <div className="flex justify-center gap-24 col-span-2 md:col-span-1">
            <TeamDisplay
              team={currentMatch?.currentMatch.team1}
              matchId={currentMatch?.currentMatch.id}
            />
            <div className="flex flex-col justify-around items-center mt-6 gap-2">
              <span className="h-fit">VS</span>
            </div>
            <TeamDisplay
              team={currentMatch?.currentMatch.team2}
              matchId={currentMatch?.currentMatch.id}
              align="right"
            />
          </div>
          <h2 className="text-4xl text-center col-span-2 md:col-span-1">
            {timeLeft < 0 ? "OVERTIMER: " : "TIMER: "} <br />
            {timeLeft < 0 ? (timeLeft + 120).toFixed(0) : timeLeft.toFixed(0)}
          </h2>
          <div>
            <h2>Previous Game</h2>
            {currentMatch?.previousMatch && (
              <MatchCard match={currentMatch?.previousMatch} />
            )}
          </div>
          <div>
            <h2>Next Game</h2>
            {currentMatch?.nextMatch && (
              <MatchCard match={currentMatch?.nextMatch} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  const id = params["id"];
  const wsBaseUrl = apiUrl.replace("https", "wss");
  const wsConnectionEndpoint = `${wsBaseUrl}/tournament/${id}/live`;

  let tournament: Tournament | null = null;
  let currentMatch: CurrentMatch | null = null;
  try {
    const response = await fetch(`${apiUrl}/tournament/${id}`);
    const result = await response.json();
    tournament = result as Tournament;

    const currentMatchResponse = await fetch(
      `${apiUrl}/tournament/${id}/currentmatch`
    );
    const currentMatchResult = await currentMatchResponse.json();
    currentMatch = currentMatchResult as CurrentMatch;
  } catch (error) {
    console.log(error);
  }

  return { wsConnectionEndpoint, tournament, currentMatch };
};

export const meta: MetaFunction = ({ matches, data }) => {
  const loaderData = data as Awaited<ReturnType<typeof loader>>;

  const currentMatch = loaderData.currentMatch?.currentMatch;
  const title = currentMatch
    ? `Round ${(currentMatch?.roundNumber ?? 0) + 1} - Match ${
        (currentMatch?.matchNumber ?? 0) + 1
      }`
    : "Live match";
  return [{ title }];
};
