import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { League, LeagueProgress } from "~/_types/tournament";
import { MatchCard, Scoreboard, TeamDisplay } from "~/components";
import { ScoreRow } from "~/components/Scoreboard/ScoreRow";
import { useTimer } from "~/hooks";
import { useWebSocket } from "~/hooks/useWebSocket";

const LivePage = () => {
  const { wsConnectionEndpoint, league, progress } =
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

  var team1players = [
    progress?.currentMatch?.team1Player1.id,
    progress?.currentMatch?.team1Player2.id,
  ];
  var team2players = [
    progress?.currentMatch?.team2Player1.id,
    progress?.currentMatch?.team2Player2.id,
  ];

  const players = league?.players
    .sort((a, b) => b.score - a.score)
    .map((p, i) => {
      const isTeam1 = team1players.includes(p.id);
      const isTeam2 = team2players.includes(p.id);
      const highlight = isTeam1 ? "purple" : isTeam2 ? "cyan" : undefined;
      return (
        <ScoreRow
          key={p.id}
          player={p}
          ind={i + 1}
          highlightColor={highlight}
        />
      );
    });

  const currentMatchItem = progress?.currentMatch;

  const completedMatchesCards = progress?.completedMatches
    ?.sort((a, b) => b.order - a.order)
    .map((m) => <MatchCard key={m.id} match={m} />);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="h-[100dvh]">
      <div className="grid grid-cols-[400px_1fr_1fr_400px] grid-rows-5 text-slate-200 h-full">
        <div className="col-span-2 col-start-2">
          <div className="flex flex-col justify-center h-full gap-2">
            <h1 className="text-6xl text-center font-semibold">
              {league?.name}
            </h1>
            {currentMatchItem && (
              <h2 className="text-3xl text-center">
                MATCH {(currentMatchItem.order ?? 0) + 1}
              </h2>
            )}
          </div>
        </div>
        <div className="p-4 m-4 rounded bg-slate-800 border border-slate-200/20 row-span-5 row-start-4 col-start-1 md:row-start-1 col-span-2 md:col-span-1 max-w-fit">
          <h2 className="text-center text-lg">Scores</h2>
          <Scoreboard>{players}</Scoreboard>
        </div>
        {currentMatchItem ? (
          <div className="flex justify-center text-xl gap-24 col-span-2 md:col-start-2 md:row-start-2">
            <TeamDisplay
              team={{
                player1: currentMatchItem.team1Player1,
                player2: currentMatchItem.team1Player2,
              }}
              matchId={currentMatchItem.id}
            />
            <div className="flex flex-col justify-around items-center mt-6 gap-2">
              <span className="h-fit">VS</span>
            </div>
            <TeamDisplay
              team={{
                player1: currentMatchItem.team2Player1,
                player2: currentMatchItem.team2Player2,
              }}
              matchId={currentMatchItem.id}
              align="right"
            />
          </div>
        ) : (
          <div className="flex justify-center col-span-2 md:col-start-2 md:row-start-2">
            <span className="text-4xl text-center ">ALL MATCHES COMPLETE</span>
          </div>
        )}
        <div className="flex flex-col justify-center items-center col-span-2 gap-16 bg-slate-950/20 mr-4">
          <div className="border-t border-slate-400/20 h-1 min-w-fit w-[60%]"></div>
          <h2 className="text-6xl text-center w-fit">
            {timeLeft < 0 ? "OVERTIMER: " : "TIMER: "} <br />
            {timeLeft < 0 ? (timeLeft + 120).toFixed(0) : timeLeft.toFixed(0)}
          </h2>
          <div className="border-t border-slate-400/20 h-1 min-w-fit w-[60%]"></div>
        </div>
        <div className="p-4 m-4 rounded bg-slate-800 border border-slate-200/20 row-span-5 row-start-4 col-start-4 md:row-start-1 col-span-2 md:col-span-1 max-w-fit w-full overflow-hidden flex flex-col">
          {!!progress?.upcomingMatches?.length && (
            <>
              <h2 className="text-center text-lg">Upcoming Game</h2>
              <MatchCard match={progress?.upcomingMatches[0]} />
              <div className="border-t border-slate-400/20 h-1 min-w-fit w-full"></div>
            </>
          )}
          <h2 className="text-center text-lg w-80">Past Games</h2>
          {!!completedMatchesCards && (
            <div className="overflow-auto flex flex-col gap-2 items-center">
              {completedMatchesCards}
            </div>
          )}
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
  const wsConnectionEndpoint = `${wsBaseUrl}/league/${id}/live`;

  let league: League | null = null;
  let progress: LeagueProgress | null = null;
  try {
    const response = await fetch(`${apiUrl}/league/${id}`);
    const result = await response.json();
    league = result as League;

    const progressResponse = await fetch(`${apiUrl}/league/${id}/progress`);
    const progressResult = await progressResponse.json();
    progress = progressResult as LeagueProgress;
  } catch (error) {
    console.log(error);
  }
  return { wsConnectionEndpoint, league, progress };
};

export const meta: MetaFunction = ({ data }) => {
  const loaderData = data as Awaited<ReturnType<typeof loader>>;

  const currentMatch = loaderData.progress?.currentMatch;
  const title = currentMatch
    ? `Match ${(currentMatch?.order ?? 0) + 1}`
    : "Live match";
  return [{ title }];
};
