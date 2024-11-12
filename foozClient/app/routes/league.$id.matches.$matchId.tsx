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

const MatchPage = () => {
  const { current, next, prev } = useLoaderData<typeof loader>();
  const { id } = useParams();

  const card = current ? <MatchCard match={current} roundNumber={0} /> : <></>;

  return (
    <div className="container mx-auto">
      <ImageHeader text="Match details" src="/images/foosHeader.jpg" alt="" />
      <TournamentNavBar>
        <LinkButton
          href={`/league/${id}/matches`}
          colorCode="Primary"
          className="self-start"
        >
          Match Overview
        </LinkButton>
        <LinkButton href={`/league/${id}/currentmatch`} colorCode="Success">
          Current Match
        </LinkButton>
        {prev && (
          <LinkButton
            href={`/league/${id}/matches/${prev.id}`}
            colorCode="Alert"
          >
            Previous Match
          </LinkButton>
        )}
        {next && (
          <LinkButton
            href={`/league/${id}/matches/${next.id}`}
            colorCode="Success"
          >
            Next Match
          </LinkButton>
        )}
      </TournamentNavBar>
      <div className="flex flex-row gap-1 sm:gap-4 flex-wrap mx-auto justify-center my-2">
        {current ? card : "Error loading match.."}
      </div>
    </div>
  );
};
export default MatchPage;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  const tournamentId = params["id"];
  const matchId = params["matchId"];
  let currentMatchResult: Match[] = [];
  let matches: Match[] = [];
  try {
    const matchesResults = await fetch(
      `${apiUrl}/league/${tournamentId}/matches`
    );
    currentMatchResult = (await matchesResults.json()) as Match[];
    matches = currentMatchResult ?? [];

    const current = matches.find((m) => m.id == matchId);
    const next = matches.find((m) => m.order == current!.order + 1);
    const prev = matches.find((m) => m.order == current!.order - 1);
    console.log(matches.filter((m) => m.order == 1));

    return json({ matches, current, next, prev });
  } catch (error) {
    console.log(error);
    return json({
      matches,
      current: undefined,
      next: undefined,
      prev: undefined,
    });
  }
};
