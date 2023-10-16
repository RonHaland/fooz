import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Tournament } from "~/_types/tournament";
import { ImageHeader } from "~/components";
import { RoundAccordion } from "~/components/RoundAccordion";

const TournamentPage = () => {
  const { tournament } = useLoaderData<typeof loader>();

  const rounds = tournament?.rounds.map((r) => {
    return <RoundAccordion round={r} key={r.roundNumber} />;
  });
  const players = tournament?.participants
    .sort((a, b) => b.score - a.score)
    .map((p) => (
      <div key={p.id}>
        {p.score.toString().padStart(2, "0")} - {p.name} / {p.matchCount}
      </div>
    ));
  return (
    <div className="container mx-auto">
      <ImageHeader
        src="/images/foosHeader.jpg"
        alt=""
        text={tournament?.name ?? "Tournament"}
      />
      {players}
      <div className="flex flex-row gap-2 flex-wrap">{rounds}</div>
    </div>
  );
};

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

export default TournamentPage;
