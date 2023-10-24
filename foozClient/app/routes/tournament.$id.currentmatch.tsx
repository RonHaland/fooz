import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import type { CurrentMatch } from "~/_types/tournament";
import { ImageHeader, LinkButton, TournamentNavBar } from "~/components";
import { MatchInfo } from "~/components/MatchInfo";

export const meta: MetaFunction = () => [{ title: "Matches" }];

const MatchesPage = () => {
  const { current } = useLoaderData<typeof loader>();
  const { id } = useParams();

  const currentMatchItem = current?.currentMatch;

  return (
    <div className="container mx-auto">
      <ImageHeader text="Current Match" src="/images/foosHeader.jpg" alt="" />
      <TournamentNavBar>
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
      <div className="flex flex-row justify-center">
        {currentMatchItem ? (
          <div className="flex flex-col">
            <h2 className="text-6xl text-center">
              {" "}
              Round {(currentMatchItem.roundNumber ?? 0) + 1} - Match{" "}
              {(currentMatchItem.matchNumber ?? 0) + 1}
            </h2>
            <MatchInfo currentMatch={currentMatchItem} />
          </div>
        ) : (
          <h2 className="text-4xl text-slate-200 my-12">COMPLETED</h2>
        )}
      </div>
    </div>
  );
};
export default MatchesPage;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  const tournamentId = params["id"];
  let current: CurrentMatch | null = null;
  try {
    const matchResult = await fetch(
      `${apiUrl}/tournament/${tournamentId}/CurrentMatch`
    );
    current = await matchResult.json();
  } catch (error) {
    console.log(error);
  }
  return json({ current, apiUrl });
};
