import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { createRef, useState } from "react";
import type { CurrentMatch, PutMatch, WinType } from "~/_types";
import { ActionButton } from "~/components";
import { MatchInfo } from "~/components/MatchInfo";
import { Modal } from "~/components/Modal";
import { AltModal } from "~/components/Modal/AltModal";
import { InfoBox } from "~/components/Modal/InfoBox";
import { usePostTimerUpdates } from "~/hooks";
import { auth } from "~/utils/auth.server";
import { GetTokenFromRequest } from "~/utils/token.server";

const CurrentMatchDashboardPage = () => {
  const { current } = useLoaderData<typeof loader>();
  const { id } = useParams();
  const { setUpdate } = usePostTimerUpdates(id ?? "");
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  //const [isEditOTOpen, setIsEditOTOpen] = useState(false);

  const editModalRef = createRef<HTMLDialogElement>();
  const currentMatch = current?.currentMatch;

  const startTimer = () => {
    setUpdate({ timerUpdate: "Start", amount: 0 });
    setIsStarted(true);
  };
  const stopTimer = () => {
    setUpdate({ timerUpdate: "Stop", amount: 0 });
    setIsStarted(false);
  };
  const pauseTimer = () => {
    setUpdate({ timerUpdate: "Pause", amount: 0 });
    setIsPaused(true);
  };
  const unpauseTimer = () => {
    setUpdate({ timerUpdate: "Unpause", amount: 0 });
    setIsPaused(false);
  };
  const editTimer = (seconds: number) => {
    setUpdate({ timerUpdate: "Edit", amount: seconds });
  };
  const editOverTimer = (seconds: number) => {
    setUpdate({ timerUpdate: "EditOvertime", amount: seconds });
  };

  const startStopButton = (
    <div className="col-start-1">
      {!isStarted ? (
        <ActionButton
          onClick={startTimer}
          colorCode="Success"
          className="w-full"
        >
          Start
        </ActionButton>
      ) : (
        <ActionButton onClick={stopTimer} colorCode="Alert" className="w-full">
          Stop
        </ActionButton>
      )}
    </div>
  );

  const pauseButton = (
    <div className="col-start-2">
      {!isPaused ? (
        <ActionButton
          onClick={pauseTimer}
          colorCode="Info"
          className="w-full"
          disabled={!isStarted}
        >
          Pause
        </ActionButton>
      ) : (
        <ActionButton
          onClick={unpauseTimer}
          colorCode="Info"
          className="w-full"
          disabled={!isStarted}
        >
          Unpause
        </ActionButton>
      )}
    </div>
  );

  return (
    <div className="container mx-auto flex flex-row justify-center pt-12">
      {currentMatch && (
        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-center text-slate-200 text-3xl sm:text-6xl w-fit">
            Round {1 + (currentMatch.roundNumber ?? 0)} - Match{" "}
            {1 + (currentMatch.matchNumber ?? 0)}
          </h2>
          <MatchInfo currentMatch={currentMatch} />
          <div>
            <h2 className="text-center">TIMER CONTROLS</h2>
            <div className="grid grid-cols-2 grid-rows-2 place-items-stretch gap-4">
              {startStopButton}
              {pauseButton}
              <ActionButton onClick={() => setIsEditOpen(true)}>
                Edit
              </ActionButton>
              <ActionButton onClick={() => editModalRef.current?.showModal()}>
                Edit OT
              </ActionButton>
            </div>
          </div>
          <div className="w-fit grid grid-cols-5 text-center text-lg text-slate-100 p-4 gap-2">
            <h3 className="col-span-2">
              Team 1: {currentMatch.team1.player1.name} -{" "}
              {currentMatch.team1.player2.name}
            </h3>
            <h3 className="col-span-2 col-start-4">
              Team 2: {currentMatch.team2.player1.name} -{" "}
              {currentMatch.team2.player2.name}
            </h3>
            <div className="col-start-1">
              <Form
                method="POST"
                action={`./?type=score&teamId=${1}&matchId=${currentMatch.id}`}
              >
                <ActionButton submit colorCode="Success">
                  Score Win
                </ActionButton>
              </Form>
            </div>
            <div className="col-start-2">
              <Form
                method="POST"
                action={`./?type=time&teamId=${1}&matchId=${currentMatch.id}`}
              >
                <ActionButton submit colorCode="Secondary">
                  Time Win
                </ActionButton>
              </Form>
            </div>

            <div className="col-start-3">
              <Form
                method="POST"
                action={`./?type=draw&matchId=${currentMatch.id}`}
              >
                <ActionButton submit colorCode="Secondary">
                  Draw
                </ActionButton>
              </Form>
            </div>
            <div className="col-start-4">
              <Form
                method="POST"
                action={`./?type=time&teamId=${2}&matchId=${currentMatch.id}`}
              >
                <ActionButton submit colorCode="Secondary">
                  Time Win
                </ActionButton>
              </Form>
            </div>

            <div className="col-start-5">
              <Form
                method="POST"
                action={`./?type=score&teamId=${2}&matchId=${currentMatch.id}`}
              >
                <ActionButton submit colorCode="Success">
                  Score Win
                </ActionButton>
              </Form>
            </div>
          </div>
        </div>
      )}
      <InfoBox open={isEditOpen} setOpen={setIsEditOpen}>
        MODAL 1
      </InfoBox>
      <AltModal ref={editModalRef}>MODAL 2</AltModal>
    </div>
  );
};

export default CurrentMatchDashboardPage;

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

  const token = GetTokenFromRequest(request);
  await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  console.log(result);

  console.log({ type, teamId, matchId });
  return json({});
};
