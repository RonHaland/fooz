import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import type { Match } from "~/_types";
import { ActionButton, MatchCardDraggable } from "~/components";
import { auth } from "~/utils/auth.server";
import { GetTokenFromRequest } from "~/utils/token.server";

const EditMatchesOrderPage = () => {
  const { matches } = useLoaderData<typeof loader>();

  const [matchList, setMatchList] = useState([...(matches ?? [])]);

  const shiftUp = useCallback(
    (id: string) => {
      const index = matchList.findIndex((m) => m.id === id);
      if (index <= 0) return;
      const newList = [
        ...matchList.slice(0, index - 1),
        matchList[index],
        matchList[index - 1],
        ...matchList.slice(index + 1),
      ];
      setMatchList(newList);
    },
    [matchList]
  );
  const shiftDown = useCallback(
    (id: string) => {
      const index = matchList.findIndex((m) => m.id === id);
      if (index < 0 || index >= matchList.length - 1) return;
      const newList = [
        ...matchList.slice(0, index),
        matchList[index + 1],
        matchList[index],
        ...matchList.slice(index + 2),
      ];
      setMatchList(newList);
    },
    [matchList]
  );

  return (
    <div className="flex w-full justify-center my-4">
      <Form method="POST">
        <ActionButton submit>SAVE</ActionButton>
        <div className="w-80 flex flex-col gap-2">
          {matchList?.map((a, i) => (
            <div key={a.id} className="flex flex-row items-center gap-2">
              <input name={a.id} value={i} type="hidden"></input>
              <div className="flex flex-col gap-2">
                <button
                  className="p-1 rounded bg-black/15"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    shiftUp(a.id);
                  }}
                  type="button"
                >
                  Up
                </button>
                <button
                  className="p-1 rounded bg-black/15"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    shiftDown(a.id);
                  }}
                  type="button"
                >
                  Down
                </button>
              </div>
              <MatchCardDraggable match={a}></MatchCardDraggable>
            </div>
          ))}
        </div>
      </Form>
    </div>
  );
};

export default EditMatchesOrderPage;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const leagueId = params["id"];

  const apiUrl = process.env.API_URL ?? "";
  let matches: Match[] | null = null;
  try {
    const matchesResult = await fetch(`${apiUrl}/league/${leagueId}/matches`);
    const parsedresult = (await matchesResult.json()) as Match[];
    matches = parsedresult ?? null;
    return json({ matches });
  } catch (error) {
    console.log(error);
    return json({ matches });
  }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = GetTokenFromRequest(request);
  await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const body = JSON.stringify(
    [...(await request.formData()).entries()].map((a) => ({
      id: a[0],
      order: a[1],
    }))
  );
  const tournamentId = params["id"];

  const apiUrl = process.env.API_URL ?? "";

  const result = await fetch(
    `${apiUrl}/league/${tournamentId}/matches/reorder`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    }
  );
  console.log(result);

  if (result.status >= 200 && result.status < 400) return redirect("./");

  return {};
};
