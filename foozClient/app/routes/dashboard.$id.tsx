import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Tournament } from "~/_types";
import { LinkButton, Scoreboard } from "~/components";
import { ScoreRow } from "~/components/Scoreboard/ScoreRow";

const TournamentDashboardPage = () => {
  const { tournament } = useLoaderData<typeof loader>();

  const scores = tournament?.participants.map((p, i) => (
    <ScoreRow key={p.id} player={p} ind={i + 1} />
  ));
  return (
    <div className="flex flex-col gap-8 pt-4 justify-center items-center container mx-auto">
      <h2 className="text-center text-2xl text-slate-200">
        {tournament?.name}
      </h2>
      <div className="grid grid-cols-2 gap-2 text-center">
        <LinkButton href={"./currentmatch"} colorCode="Success">
          Current Match
        </LinkButton>
        <LinkButton href={"./matches"} colorCode="Info">
          Edit other match
        </LinkButton>
      </div>
      <div className="col-span-2 rounded-lg p-4 mx-4 sm:mx-8 bg-sky-950">
        <Scoreboard>{scores}</Scoreboard>
      </div>
    </div>
  );
};

export default TournamentDashboardPage;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tournamentId = params["id"];

  const apiUrl = process.env.API_URL ?? "";
  let tournament: Tournament | null = null;
  try {
    const tournamentResult = await fetch(
      `${apiUrl}/tournament/${tournamentId}`
    );
    const parsedresult = (await tournamentResult.json()) as Tournament;
    tournament = parsedresult ?? null;
    return json({ tournament });
  } catch (error) {
    console.log(error);
    return json({ tournament });
  }
};
