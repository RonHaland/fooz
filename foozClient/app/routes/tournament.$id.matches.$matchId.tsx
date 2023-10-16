import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import type { CurrentMatch } from "~/_types/tournament";
import {
  ImageHeader,
  LinkButton,
  MatchCard,
  TournamentNavBar,
} from "~/components";

export const meta: MetaFunction = () => [{ title: "Matches" }];

const MatchPage = () => {
  const { match: current } = useLoaderData<typeof loader>();
  const { id } = useParams();

  const card = current ? (
    <MatchCard match={current.currentMatch} roundNumber={0} />
  ) : (
    <></>
  );

  return (
    <div className="container mx-auto">
      <ImageHeader text="Match details" src="/images/foosHeader.jpg" alt="" />
      <TournamentNavBar>
        <LinkButton
          href={`/tournament/${id}/matches`}
          colorCode="Primary"
          className="self-start"
        >
          Match Overview
        </LinkButton>
        <LinkButton href={`/tournament/${id}/currentmatch`} colorCode="Success">
          Current Match
        </LinkButton>
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
      <div className="flex flex-row gap-1 sm:gap-4 flex-wrap mx-auto justify-center my-2">
        {!!current ? card : "Error loading match.."}
      </div>
    </div>
  );
};
export default MatchPage;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  const tournamentId = params["id"];
  const matchId = params["matchId"];
  let currentMatchResult: CurrentMatch | null = null;
  let targetMatch: CurrentMatch | null = null;
  try {
    const currentMatch = await fetch(
      `${apiUrl}/tournament/${tournamentId}/matches/${matchId}`
    );
    currentMatchResult = (await currentMatch.json()) as CurrentMatch;
    targetMatch = currentMatchResult ?? null;
    return json({ match: targetMatch });
  } catch (error) {
    console.log(error);
    return json({ match: targetMatch });
  }
};
