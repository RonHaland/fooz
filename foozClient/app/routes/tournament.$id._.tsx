import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Tournament } from "~/_types/tournament";
import { ImageHeader, LinkButton, Scoreboard } from "~/components";
import { RoundAccordion } from "~/components/RoundAccordion";
import { ScoreRow } from "~/components/Scoreboard/ScoreRow";

const TournamentPage = () => {
  const { tournament } = useLoaderData<typeof loader>();

  const rounds = tournament?.rounds.map((r) => {
    return <RoundAccordion round={r} key={r.roundNumber} />;
  });
  const players = tournament?.participants
    .sort((a, b) => b.score - a.score)
    .map((p, i) => <ScoreRow key={p.id} player={p} ind={i + 1} />);
  return (
    <div className="container mx-auto">
      <ImageHeader
        src="/images/foosHeader.jpg"
        alt=""
        text={tournament?.name ?? "Tournament"}
      />
      <div className="flex flex-row my-4">
        <LinkButton href="/">Home</LinkButton>
      </div>
      <div className="grid grid-cols-1 grid-rows-4 md:grid-rows-2 md:grid-cols-2 gap-2 md:gap-4 mx-2 md:mx-0">
        <div className="bg-sky-950 rounded-lg p-4 row-span-2 h-fit">
          <Scoreboard>{players}</Scoreboard>
        </div>
        <div className="flex flex-col justify-start gap-4 bg-sky-950 rounded-lg p-4">
          <h2 className="text-center text-2xl">Rounds</h2>
          <div className="flex flex-row gap-2 flex-wrap justify-center items-start">
            {rounds}
          </div>
        </div>
        <div className="rounded-lg p-4 bg-sky-950 h-fit">
          <div className="flex flex-row gap-2 flex-wrap">
            <LinkButton href="./matches" outlined>
              Match Overview
            </LinkButton>
            {!tournament?.isCompleted && (
              <LinkButton href="./live" colorCode="Secondary" outlined>
                Live
              </LinkButton>
            )}
            {!tournament?.isCompleted && (
              <LinkButton href="./currentMatch" colorCode="Success" outlined>
                Next match
              </LinkButton>
            )}
          </div>
        </div>
      </div>
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
