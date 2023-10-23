import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { TournamentListItem } from "~/_types/tournament";
import { TournamentList } from "~/components/TournamentList";

const TournamentPage = () => {
  const { tournaments } = useLoaderData<typeof loader>();

  const tournamentItems = tournaments as any as TournamentListItem[];
  return (
    <div>
      <TournamentList tournaments={tournamentItems} manage={false} />
    </div>
  );
};

export default TournamentPage;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const apiUrl = process.env.API_URL ?? "";
  let tournaments: TournamentListItem[] = [];
  try {
    const response = await fetch(`${apiUrl}/Tournaments`);
    const result = (await response.json()) as TournamentListItem[];
    tournaments = result;
  } catch (error) {
    console.log(error);
  }
  return { tournaments };
};
