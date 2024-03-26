import { ActionFunctionArgs, redirect } from "@remix-run/node";
import {
  Form,
  MetaFunction,
  json,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { FaFutbol } from "react-icons/fa6";
import type { LoaderFunctionArgs } from "react-router";
import { CreateRankedMatchState, RankedPlayer } from "~/_types";
import { ActionButton, ToggleSwitch } from "~/components";
import { DraggablePlayer } from "~/components/DraggablePlayer";
import { PlayerDropArea } from "~/components/PlayerDropArea";
import { requireFeature } from "~/utils/features";
import { GetTokenFromRequest } from "~/utils/token.server";

const RankedNewMatchPage = () => {
  const [playerFilter, setPlayerFilter] = useState("");
  const [createMatchForm, setCreateMatchForm] =
    useState<CreateRankedMatchState>({
      randomTeamsList: [],
      team1List: [],
      team2List: [],
      useRandomTeams: true,
    });
  const { players } = useLoaderData<typeof loader>();
  const errorList = useActionData<typeof action>();

  const handleSwitch = (state: boolean) => {
    setCreateMatchForm((s) => ({ ...s, useRandomTeams: state }));
  };

  const removePlayer = (id: string) => {
    if (createMatchForm.useRandomTeams) {
      setCreateMatchForm((s) => ({
        ...s,
        randomTeamsList: [...s.randomTeamsList.filter((p) => p != id)],
      }));
      return;
    }

    setCreateMatchForm((s) => ({
      ...s,
      team1List: [...s.team1List.filter((p) => p != id)],
      team2List: [...s.team2List.filter((p) => p != id)],
    }));
  };

  const addPlayer = useMemo(
    () => (id: string, field?: string) => {
      if (createMatchForm.useRandomTeams) {
        if (
          createMatchForm.randomTeamsList.length < 7 &&
          !createMatchForm.randomTeamsList.includes(id)
        ) {
          setCreateMatchForm((s) => ({
            ...s,
            randomTeamsList: [...s.randomTeamsList, id],
          }));
        }
        return;
      }

      if (
        createMatchForm.team1List.includes(id) &&
        createMatchForm.team2List.includes(id)
      )
        return;

      if (
        createMatchForm.team1List.length < 2 &&
        (!field || field == "Area1")
      ) {
        setCreateMatchForm((s) => ({
          ...s,
          team1List: [...s.team1List, id],
        }));
        return;
      }
      if (
        createMatchForm.team2List.length < 2 &&
        (!field || field == "Area2")
      ) {
        setCreateMatchForm((s) => ({
          ...s,
          team2List: [...s.team2List, id],
        }));
      }
    },
    [createMatchForm, setCreateMatchForm]
  );

  const notWithinCurrentTeams = (player: RankedPlayer) => {
    return !(createMatchForm.useRandomTeams
      ? createMatchForm.randomTeamsList.includes(player.id)
      : createMatchForm.team1List.includes(player.id) ||
        createMatchForm.team2List.includes(player.id));
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerFilter(e.target.value);
  };

  const playerListItems = useMemo(
    () =>
      players
        .filter(notWithinCurrentTeams)
        .filter((p) =>
          p.name.toLocaleLowerCase().includes(playerFilter.toLocaleLowerCase())
        )
        .slice(0, 10)
        .map((p, i) => (
          <DraggablePlayer
            key={p.id}
            player={p}
            onAddPlayer={addPlayer}
          ></DraggablePlayer>
        )),
    [createMatchForm, playerFilter]
  );

  const errorMessage2 = useMemo(() => {
    return errorList?.errors.join("\n");
  }, [errorList]);
  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="text-4xl md:text-[10rem] flex flex-col items-center text-slate-100 text-center mt-4 md:mt-8">
          <FaFutbol />
          <span className="text-lg md:text-7xl">Create Ranked Match</span>
        </div>
        <Form method="POST">
          <div className="grid grid-cols-3 grid-rows-[auto_1fr_1fr_auto] gap-2 my-10 mx-2">
            <label
              className="flex flex-row items-center gap-4 col-span-3"
              id="randomTeamsLabel"
            >
              Random teams:
              <ToggleSwitch
                onColor="Success"
                offColor="Alert"
                name="toggle"
                onToggle={handleSwitch}
                value={createMatchForm.useRandomTeams}
                aria-labelledby="randomTeamsLabel"
              />
            </label>
            <div className="flex flex-col gap-2 col-span-1 row-span-3 mx-1">
              <label id="playerFilterLabel">filter: </label>
              <input
                className="rounded focus:outline focus:outline-orange-400 p-1"
                type="text"
                value={playerFilter}
                onChange={handleFilterChange}
                aria-labelledby="playerFilterLabel"
              ></input>
              <div className="flex flex-col gap-1 select-none ">
                {playerListItems}
              </div>
            </div>
            <div className="col-span-2 row-span-2">
              {createMatchForm.useRandomTeams ? (
                <label>
                  players:{" "}
                  <PlayerDropArea
                    allPlayers={players}
                    playerPool={createMatchForm.randomTeamsList}
                    onRemove={removePlayer}
                    onDrop={addPlayer}
                  ></PlayerDropArea>
                </label>
              ) : (
                <>
                  <label>
                    team1:
                    <PlayerDropArea
                      allPlayers={players}
                      playerPool={createMatchForm.team1List}
                      onRemove={removePlayer}
                      onDrop={addPlayer}
                      id="Area1"
                    ></PlayerDropArea>
                  </label>
                  <label>
                    team2:
                    <PlayerDropArea
                      allPlayers={players}
                      playerPool={createMatchForm.team2List}
                      onRemove={removePlayer}
                      onDrop={addPlayer}
                      id="Area2"
                    ></PlayerDropArea>
                  </label>
                </>
              )}
            </div>
            <div className="place-self-center col-span-2">
              <ActionButton submit colorCode="Success">
                Create Match
              </ActionButton>
            </div>
          </div>
        </Form>
        <span className="text-red-400 w-full overflow-hidden">
          {errorMessage2}
        </span>
      </div>
    </>
  );
};

export default RankedNewMatchPage;

export const meta: MetaFunction = ({}) => {
  return [{ title: "Create Ranked Match" }];
};

export const loader = async ({}: LoaderFunctionArgs) => {
  requireFeature("Ranked");

  const url = `${process.env.API_URL}/Ranked/Players`;
  const response = await fetch(url);
  const players = (await response.json()) as RankedPlayer[];

  return json({ players });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const token = GetTokenFromRequest(request);
  const apiUrl = process.env.API_URL;
  const errors: string[] = [];

  if (formData.get("toggle") === "true") {
    const playerIds: string[] = [];
    formData.forEach((fd, k) => {
      if (k.startsWith("player")) playerIds.push(fd.toString());
    });
    const body = JSON.stringify({ playerIds });
    const result = await fetch(`${apiUrl}/Ranked/Match`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (result.ok) throw redirect("/Ranked");

    errors.push(await result.text());
    return json({ errors });
  }

  const players0 = formData.getAll("player[0]");
  const players1 = formData.getAll("player[1]");
  const team1PlayerIds = [players0[0], players1[0]];
  const team2PlayerIds = [players0[1], players1[1]];
  const body = JSON.stringify({ team1PlayerIds, team2PlayerIds });
  console.log(players0);
  console.log(players1);

  const result = await fetch(`${apiUrl}/Ranked/Match/Custom`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  });

  if (result.ok) throw redirect("/Ranked");

  errors.push(await result.text());

  return json({ errors });
};
