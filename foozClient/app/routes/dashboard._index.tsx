import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { TournamentListItem } from "~/_types";
import { LinkButton } from "~/components";
import { Pagination } from "~/components/Pagination";
import { usePagination } from "~/hooks/usePagination";

const DashboardPage = () => {
  const { tournaments } = useLoaderData<typeof loader>();
  const { setPage, pageItems, maxPages, page } = usePagination(10, tournaments);

  const tournamentsButtons = pageItems.map((t) => (
    <tr key={t.id} className="border-b border-slate-100/20">
      <td className="p-1 sm:py-3">
        <div className="flex flex-col text-slate-300">
          <span className="font-semibold">{t.name}</span>
          <span className="sm:hidden">
            {new Date(t.time).toLocaleDateString()}
          </span>
        </div>
      </td>
      <td className="hidden sm:block">
        {new Date(t.time).toLocaleDateString()}
      </td>
      <td className="pl-1">
        <LinkButton href={`./${t.id}`}>Manage</LinkButton>
      </td>
    </tr>
  ));
  return (
    <div className="flex flex-col container mx-auto items-center">
      <div className="sm:w-fit flex flex-col items-center pt-8">
        <h2 className="text-2xl text-slate-200">
          TOURNAMENTS: {tournaments.length}
        </h2>
        <div className="max-sm:min-h-[512px] sm:h-[512px] overflow-y-auto">
          <table className="table-fixed ">
            <thead>
              <tr>
                <th className="w-60 sm:w-60"></th>
                <th className="hidden sm:block sm:w-24"></th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>{tournamentsButtons}</tbody>
          </table>
        </div>
        <div className="max-sm:my-4 ">
          <Pagination page={page} setPage={setPage} totalPages={maxPages} />
        </div>
      </div>
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
