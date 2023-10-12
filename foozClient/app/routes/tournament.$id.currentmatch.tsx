import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import type { CurrentMatch, Team } from "~/_types/tournament";
import {
  ActionButton,
  ImageHeader,
  LinkButton,
  TournamentNavBar,
} from "~/components";
import { useTimer } from "~/hooks/useTimer";

export const meta: MetaFunction = () => [{ title: "Matches" }];

const MatchesPage = () => {
  const { current } = useLoaderData<typeof loader>();
  const { id } = useParams();
  const { timeLeft, isStarted, isPaused, toggleStarted, togglePause } =
    useTimer(360);

  const toggleTimerButton = isStarted ? (
    <ActionButton onClick={toggleStarted} colorCode="Alert">
      stop
    </ActionButton>
  ) : (
    <ActionButton onClick={toggleStarted} colorCode="Primary">
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

const TeamDisplay = ({
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
      >
        <Form
          method="POST"
          action={`?type=10&teamId=${team?.id}&matchId=${matchId}`}
        >
          <ActionButton submit colorCode="Success">
            Score Win
          </ActionButton>
        </Form>
        <Form
          method="POST"
          action={`?type=time&teamId=${team?.id}&matchId=${matchId}`}
        >
          <ActionButton submit colorCode="Warning">
            Time Win
          </ActionButton>
        </Form>
      </div>
    </div>
  );
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  const tournamentId = params["id"];
  let current: CurrentMatch | null = null;
  try {
    const matchResult = await fetch(
      `${apiUrl}/tournament/${tournamentId}/CurrentMatch`
    );
    current = await matchResult.json();
    return json({ current });
  } catch (error) {
    console.log(error);
    return json({ current });
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const type = searchParams.get("type");
  const teamId = searchParams.get("teamId");
  const matchId = searchParams.get("matchId");
  console.log({ type, teamId, matchId });
  return json({});
};
