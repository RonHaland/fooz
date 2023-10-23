import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import type { CurrentMatch } from "~/_types/tournament";
import {
  ActionButton,
  ImageHeader,
  LinkButton,
  TournamentNavBar,
} from "~/components";
import { MatchInfo } from "~/components/MatchInfo";
import { usePostTimerUpdates } from "~/hooks/usePostTimerUpdates";
import { useTimer } from "~/hooks/useTimer";
import { GetTokenFromRequest } from "~/utils/token.server";

export const meta: MetaFunction = () => [{ title: "Matches" }];

const MatchesPage = () => {
  const { current, apiUrl } = useLoaderData<typeof loader>();
  const { id } = useParams();
  const { timeLeft, isStarted, isPaused, toggleStarted, togglePause } =
    useTimer(360);

  const { setUpdate } = usePostTimerUpdates(apiUrl, id ?? "");

  const start = () => {
    setUpdate({ timerUpdate: "Start" });
    toggleStarted();
  };
  const stop = () => {
    setUpdate({ timerUpdate: "Stop" });
    toggleStarted();
  };

  const toggleTimerButton = isStarted ? (
    <ActionButton onClick={stop} colorCode="Alert">
      stop
    </ActionButton>
  ) : (
    <ActionButton onClick={start} colorCode="Primary">
      start
    </ActionButton>
  );
  const togglePauseButton = isPaused ? (
    <ActionButton onClick={togglePause} colorCode="Info">
      unpause
    </ActionButton>
  ) : (
    <ActionButton onClick={togglePause} colorCode="Info">
      pause
    </ActionButton>
  );

  return (
    <div className="container mx-auto">
      <ImageHeader text="Current Match" src="/images/foosHeader.jpg" alt="" />
      <TournamentNavBar>
        {current?.previousMatch && (
          <LinkButton
            href={`/tournament/${id}/matches/${current?.previousMatch?.id}`}
            colorCode="Alert"
          >
            Previous Match
          </LinkButton>
        )}
        {current?.nextMatch && (
          <LinkButton
            href={`/tournament/${id}/matches/${current?.nextMatch?.id}`}
            colorCode="Success"
          >
            Next Match
          </LinkButton>
        )}
      </TournamentNavBar>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col">
          <h2 className="text-6xl text-center">
            {" "}
            Round {(current?.currentMatch.roundNumber ?? 0) + 1} - Match{" "}
            {(current?.currentMatch.matchNumber ?? 0) + 1}
          </h2>
          <MatchInfo currentMatch={current?.currentMatch ?? ({} as any)} />
          <div className="my-8">
            <h2 className="text-center text-5xl">
              {timeLeft < 0 ? "OVERTIMER: " : "TIMER: "} <br />
              {timeLeft < 0 ? (timeLeft + 120).toFixed(0) : timeLeft.toFixed(0)}
            </h2>
            <div className="flex justify-center gap-2 my-6">
              {toggleTimerButton}
              {!!isStarted && togglePauseButton}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MatchesPage;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  const tournamentId = params["id"];
  let current: CurrentMatch | null = null;
  try {
    const matchResult = await fetch(
      `${apiUrl}/tournament/${tournamentId}/CurrentMatch`
    );
    current = await matchResult.json();
  } catch (error) {
    console.log(error);
  }
  return json({ current, apiUrl });
};
