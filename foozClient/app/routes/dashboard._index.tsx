import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import type { LeagueListItem } from "~/_types";
import { LeagueList } from "~/components/LeagueList";
import { useEffect } from "react";
import type { DashboardContext } from "./dashboard";
import { LinkButton } from "~/components";

const DashboardPage = () => {
  const { leagues } = useLoaderData<typeof loader>();
  const { setButtons } = useOutletContext<DashboardContext>();
  const navButtons = (
    <>
      <LinkButton href="/dashboard/create">Create League</LinkButton>
    </>
  );
  useEffect(() => {
    setButtons(navButtons);
  }, []);
  return (
    <div className="flex flex-col container mx-auto items-center pt-8">
      <LeagueList leagues={leagues as any} manage />
    </div>
  );
};

export default DashboardPage;

export const loader = async ({}: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL;
  let leagues: LeagueListItem[] = [];

  try {
    const leaguesResponse = await fetch(`${apiUrl}/leagues`);
    const leaguesResult = (await leaguesResponse.json()) as LeagueListItem[];
    leagues = leaguesResult;
  } catch (error) {
    console.log(error);
  }
  return json({ leagues });
};
