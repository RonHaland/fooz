import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import type { Match } from "~/_types/tournament";
import {
  ImageHeader,
  LinkButton,
  MatchCard,
  TournamentNavBar,
} from "~/components";

export const meta: MetaFunction = () => [{ title: "Matches" }];

const MatchesPage = () => {
  const { matches } = useLoaderData<typeof loader>();
  const { id } = useParams();

  const cards = matches?.map((m) => <MatchCard key={m.id} match={m} />);
  const allCompleted = matches.every((m) => m.isCompleted);

  return (
    <div className="container mx-auto">
      <ImageHeader text="Match overview" src="/images/foosHeader.jpg" alt="" />
      <TournamentNavBar>
        <LinkButton href={`/league/${id}/currentmatch`} colorCode="Success">
          Current Match
        </LinkButton>
      </TournamentNavBar>
      <div className="flex flex-row gap-1 sm:gap-4 flex-wrap mx-auto justify-center my-2">
        {cards?.length ? cards : "Error loading matches.."}
        {!!cards?.length && allCompleted && "DONE!"}
      </div>
    </div>
  );
};
export default MatchesPage;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  const tournamentId = params["id"];
  let matches: Match[] = [];
  try {
    const matchResult = await fetch(`${apiUrl}/league/${tournamentId}/matches`);
    matches = (await matchResult.json()) as Match[];
    return json({ matches });
  } catch (error) {
    console.log(error);
    return json({ matches });
  }
};
