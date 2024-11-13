import type { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  redirect,
  useActionData,
  useOutletContext,
} from "@remix-run/react";
import type { ChangeEvent } from "react";
import { createRef, useEffect, useState } from "react";
import { ActionButton } from "~/components";
import type { DashboardContext } from "./dashboard";
import type { CreateLeagueFrom } from "~/_types/createLeagueFrom";
import { PlayerInput } from "~/components/PlayerInput";
import { GetTokenFromRequest } from "~/utils/token.server";
import { ConfirmationModal } from "~/components/Modal";

const CreateLeague = () => {
  const errors = useActionData<typeof action>();

  const { setButtons } = useOutletContext<DashboardContext>();
  const [formState, setFormState] = useState<CreateLeagueFrom>({
    name: "",
    players: [],
    matchCount: 0,
  });
  const [matchCountOptions, setmatchCountOptions] = useState<JSX.Element[]>([]);
  const [playerInputs, setPlayerinputs] = useState<JSX.Element>();
  const [errMessage, setErrMessage] = useState(errors?.message);

  const confirmBoxRef = createRef<HTMLDialogElement>();

  const buttons = <></>;
  useEffect(() => {
    setButtons(buttons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchMatchCounts = async () => {
      const fetchResult = await fetch(
        `/api/matchcounts/${formState.players?.length ?? 0}`
      );
      const data = (await fetchResult.json()) as number[];

      const options = data.map((d, i) => (
        <option key={i} value={d}>
          {d}
        </option>
      ));
      setmatchCountOptions(options);
    };

    fetchMatchCounts();
  }, [formState.players?.length]);

  useEffect(() => {
    setErrMessage(errors?.message);
  }, [errors]);

  useEffect(() => {
    const updatePlayer = (val: string, n: number) => {
      const newPlayerArray = [
        ...formState.players.slice(0, n),
        val,
        ...formState.players.slice(n + 1),
      ];

      setFormState({
        ...formState,
        players: newPlayerArray,
      });
    };

    const removePlayer = (n: number) => {
      console.log(formState.players);
      console.log(formState.players[n]);
      const newPlayerArray = [...formState.players];
      newPlayerArray.splice(n, 1);
      console.log(newPlayerArray);

      setFormState({
        ...formState,
        players: newPlayerArray,
      });
    };

    const inputs = (
      <div className="flex flex-col gap-1 w-full">
        <span>Players: </span>
        {formState.players.concat([""]).map((p, i) => {
          return (
            <PlayerInput
              id={`player_${i}`}
              number={i}
              key={i}
              onChange={(e) => updatePlayer(e.target.value, i)}
              onDelete={() => removePlayer(i)}
              initialValue={formState.players[i]}
            ></PlayerInput>
          );
        })}
      </div>
    );

    setPlayerinputs(inputs);
  }, [formState]);

  const onSelectedMatchCountChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormState({ ...formState, matchCount: parseInt(e.target.value ?? "0") });
  };

  const onOpenModal = () => {
    setErrMessage(undefined);
    confirmBoxRef.current?.showModal();
  };

  return (
    <>
      <div className="flex flex-row justify-center mt-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-4xl text-slate-100">Create League</h2>
          {errMessage && <h2>Error {errMessage}</h2>}

          <Form method="post">
            <div className="flex flex-row justify-center mt-4">
              <div className="flex flex-col items-start gap-2 min-w-48 text-slate-200 lg:w-80">
                <label htmlFor="name">Name: </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formState?.name}
                  className="rounded p-2 pr-10 focus-within:outline focus-within:outline-orange-600 bg-transparent border-slate-200 border-2 w-full"
                  onChange={(v) =>
                    setFormState({ ...formState, name: v.target.value })
                  }
                ></input>
                {playerInputs}
                <label htmlFor="matchCount">Total number of matches: </label>
                <select
                  id="matchCount"
                  name="matchCount"
                  onChange={onSelectedMatchCountChange}
                  value={formState.matchCount ?? 0}
                  className="rounded p-2 focus-within:outline focus-within:outline-orange-600 w-full bg-transparent border-slate-200 border-2 focus:bg-slate-800"
                >
                  {!!matchCountOptions.length && matchCountOptions}
                  {!matchCountOptions.length && (
                    <option disabled>Need at least 4 players...</option>
                  )}
                </select>
                <ActionButton colorCode="Success" onClick={onOpenModal}>
                  Create
                </ActionButton>
              </div>
            </div>
            <ConfirmationModal
              ref={confirmBoxRef}
              submit
              handleConfirm={() => confirmBoxRef.current?.close()}
            ></ConfirmationModal>
          </Form>
        </div>
      </div>
    </>
  );
};

export default CreateLeague;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const token = GetTokenFromRequest(request);

  const players: string[] = [];
  formData.forEach((fd, k) => {
    if (k.startsWith("player-") && fd.toString().length)
      players.push(fd.toString());
  });
  const name = formData.get("name")?.toString() ?? "";
  const matchCount = parseInt(formData.get("matchCount")?.toString() ?? "0");
  const createLeague: CreateLeagueFrom = { name, matchCount, players };
  const url = `${process.env.API_URL}/League`;
  const jsonBody = JSON.stringify(createLeague);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "post",
    body: jsonBody,
  });

  if (response.status >= 200 && response.status < 400)
    throw redirect("/dashboard");
  return { status: response.status, message: response.statusText };
};
