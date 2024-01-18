import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LeagueListItem } from "~/_types/tournament";
import { LeagueList } from "~/components/LeagueList";

const LeaguePage = () => {
  const { leagues } = useLoaderData<typeof loader>();

  const tournamentItems = leagues as any as LeagueListItem[];
  return (
    <div>
      <LeagueList leagues={tournamentItems} manage={false} />
    </div>
  );
};

export default LeaguePage;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  let leagues: LeagueListItem[] = [];
  try {
    const response = await fetch(`${apiUrl}/Leagues`);
    const result = (await response.json()) as LeagueListItem[];
    leagues = result;
  } catch (error) {
    console.log(error);
  }
  return { leagues };
};
