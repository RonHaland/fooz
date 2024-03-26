import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { createRef, useEffect, useState } from "react";
import type { Match, PutMatch, WinType } from "~/_types";
import { MatchCard } from "~/components";
import { EditMatchModalContent } from "~/components/EditMatchModalContent";
import { AltModal } from "~/components/Modal/AltModal";
import { auth } from "~/utils/auth.server";
import { GetTokenFromRequest } from "~/utils/token.server";

const MatchesDashboardPage = () => {
  const { matches } = useLoaderData<typeof loader>();
  const [editMatch, setEditMatch] = useState<Match | undefined>();

  const editModalRef = createRef<HTMLDialogElement>();

  useEffect(() => {
    const match = matches?.find((m) => m.id == editMatch?.id);
    setEditMatch(match);
  }, [matches]);

  const scores = matches?.map((p, i) => {
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      setEditMatch(p);
      editModalRef.current?.showModal();
    };
    return (
      <div key={p.id} onClick={onClick}>
        <MatchCard match={p} roundNumber={p.order} />
      </div>
    );
  });
  return (
    <div className="flex flex-col gap-8 pt-4 justify-center items-center container mx-auto mb-4">
      <h1 className="text-4xl text-slate-100 mt-8 mb-4">Edit Matches</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 text-center">
        {scores}
      </div>
      <AltModal ref={editModalRef}>
        <div className="flex flex-row justify-center">
          {editMatch && (
            <EditMatchModalContent match={editMatch}></EditMatchModalContent>
          )}
        </div>
      </AltModal>
    </div>
  );
};

export default MatchesDashboardPage;

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
    `${apiUrl}/league/${tournamentId}/matches/${matchId}`,
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
