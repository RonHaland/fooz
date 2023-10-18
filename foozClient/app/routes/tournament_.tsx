import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { TournamentListItem } from "~/_types/tournament";
import { LinkButton } from "~/components";

const TournamentPage = () => {
  const { tournaments } = useLoaderData<typeof loader>();

  const buttons = tournaments.map((t) => (
    <LinkButton key={t.time} href={`/Tournament/${t.id}`}>
      {t.name}
    </LinkButton>
  ));
  return <>{buttons}</>;
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
