import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { League } from "~/_types/tournament";
import { ImageHeader, LinkButton, Scoreboard } from "~/components";
import { ScoreRow } from "~/components/Scoreboard/ScoreRow";

const LeaguePage = () => {
  const { league } = useLoaderData<typeof loader>();

  const players = league?.players
    .sort((a, b) => b.score - a.score)
    .map((p, i) => <ScoreRow key={p.id} player={p} ind={i + 1} />);
  return (
    <div className="container mx-auto">
      <ImageHeader
        src="/images/foosHeader.jpg"
        alt=""
        text={league?.name ?? "League"}
      />
      <div className="flex flex-row my-4">
        <LinkButton href="/">Home</LinkButton>
      </div>
      <div className="grid grid-cols-1 grid-rows-4 md:grid-rows-2 md:grid-cols-2 gap-2 md:gap-4 mx-2 md:mx-0">
        <div className="bg-sky-950 rounded-lg p-4 row-span-2 h-fit">
          <Scoreboard>{players}</Scoreboard>
        </div>
        <div className="rounded-lg p-4 bg-sky-950 h-fit">
          <div className="flex flex-row gap-2 flex-wrap">
            <LinkButton href="./matches" outlined>
              Match Overview
            </LinkButton>
            {!league?.isCompleted && (
              <LinkButton href="./live" colorCode="Secondary" outlined>
                Live
              </LinkButton>
            )}
            {!league?.isCompleted && (
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const leagueId = params["id"];

  const apiUrl = process.env.API_URL ?? "";
  let league: League | null = null;
  try {
    const leagueResult = await fetch(`${apiUrl}/league/${leagueId}`);
    const parsedresult = (await leagueResult.json()) as League;
    league = parsedresult ?? null;
    return json({ league });
  } catch (error) {
    console.log(error);
    return json({ league });
  }
};

export default LeaguePage;
