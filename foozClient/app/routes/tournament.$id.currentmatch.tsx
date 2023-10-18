import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import type { CurrentMatch, PutMatch, WinType } from "~/_types/tournament";
import {
  ActionButton,
  ImageHeader,
  LinkButton,
  TeamDisplay,
  TournamentNavBar,
} from "~/components";
import { usePostTimerUpdates } from "~/hooks/usePostTimerUpdates";
import { useTimer } from "~/hooks/useTimer";

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
          <div className="flex justify-between my-8 gap-24">
            <TeamDisplay
              team={current?.currentMatch.team1}
              matchId={current?.currentMatch.id}
            />
            <div className="flex flex-col justify-around items-center mt-6 gap-2">
              <span className="h-fit">VS</span>
              <Form
                method="POST"
                action={`?type=draw&matchId=${current?.currentMatch.id}`}
              >
                <ActionButton submit colorCode="Warning">
                  draw
                </ActionButton>
              </Form>
            </div>
            <TeamDisplay
              team={current?.currentMatch.team2}
              matchId={current?.currentMatch.id}
              align="right"
            />
          </div>
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const tournamentId = params["id"];
  const type = searchParams.get("type") as WinType;
  const teamId = searchParams.get("teamId");
  const matchId = searchParams.get("matchId");

  const apiUrl = process.env.API_URL ?? "";

  const data = {
    winningTeam: Number.parseInt(teamId ?? "0"),
    winType: type,
  } as PutMatch;
  const result = await fetch(
    `${apiUrl}/Tournament/${tournamentId}/Matches/${matchId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  console.log(result);

  console.log({ type, teamId, matchId });
  return json({});
};
