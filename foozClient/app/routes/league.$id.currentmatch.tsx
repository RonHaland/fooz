import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import type { LeagueProgress } from "~/_types/tournament";
import { ImageHeader, LinkButton, TournamentNavBar } from "~/components";
import { MatchInfo } from "~/components/MatchInfo";

export const meta: MetaFunction = () => [{ title: "Matches" }];

const MatchesPage = () => {
  const { progress } = useLoaderData<typeof loader>();
  const { id } = useParams();

  const currentMatchItem = progress?.currentMatch;

  return (
    <div className="container mx-auto">
      <ImageHeader text="Current Match" src="/images/foosHeader.jpg" alt="" />
      <TournamentNavBar>
        {progress?.completedMatches && (
          <LinkButton
            href={`/league/${id}/matches/${
              progress?.completedMatches?.[progress.completedMatches.length - 1]
                ?.id
            }`}
            colorCode="Alert"
          >
            Previous Match
          </LinkButton>
        )}
        {!!progress?.upcomingMatches?.length && (
          <LinkButton
            href={`/league/${id}/matches/${progress?.upcomingMatches?.[0]?.id}`}
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
              Match {(currentMatchItem.order ?? 0) + 1}
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  const tournamentId = params["id"];
  let progress: LeagueProgress | null = null;
  try {
    const matchResult = await fetch(
      `${apiUrl}/league/${tournamentId}/progress`
    );
    progress = await matchResult.json();
  } catch (error) {
    console.log(error);
  }
  return json({ progress, apiUrl });
};
