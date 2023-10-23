import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { TournamentListItem } from "~/_types";
import { TournamentList } from "~/components/TournamentList";

const DashboardPage = () => {
  const { tournaments } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col container mx-auto items-center pt-8">
      <TournamentList tournaments={tournaments as any} manage />
    </div>
  );
};

export default DashboardPage;

export const loader = async ({}: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL;
  let tournaments: TournamentListItem[] = [];

  try {
    const tournamentsResponse = await fetch(`${apiUrl}/tournaments`);
    const tournamentsResult =
      (await tournamentsResponse.json()) as TournamentListItem[];
    tournaments = tournamentsResult;
  } catch (error) {
    console.log(error);
  }
  return json({ tournaments });
};
