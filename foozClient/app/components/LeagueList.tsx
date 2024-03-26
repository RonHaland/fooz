import type { LeagueListItem } from "~/_types";
import { usePagination } from "~/hooks";
import { Pagination } from "./Pagination";
import { ActionButton, LinkButton } from ".";
import { Form, Link } from "@remix-run/react";

type Props = {
  leagues: LeagueListItem[];
  manage?: boolean;
  pageSize?: number;
};

export const LeagueList = ({
  leagues: tournaments,
  manage = false,
  pageSize = 10,
}: Props) => {
  const { setPage, pageItems, maxPages, page } = usePagination(
    pageSize,
    tournaments
  );

  const leaguesButtons = pageItems.map((t) => (
    <tr
      key={t.id}
      className="border-b border-slate-100/20 first-of-type:border-t"
    >
      <td className="p-1 sm:py-3">
        <div className="flex flex-col text-slate-300 w-40 sm:w-60 ">
          <Link
            to={`./${t.id}`}
            className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden h-6"
            title={t.name}
          >
            {t.name}
          </Link>
          <span className="sm:hidden">
            {new Date(t.time).toLocaleDateString()}
          </span>
        </div>
      </td>
      <td className="hidden p-3 sm:block">
        {new Date(t.time).toLocaleDateString()}
      </td>
      <td className="pl-1">
        <div>
          <LinkButton href={`./${t.id}`}>{manage ? "Manage" : "Go"}</LinkButton>
        </div>
      </td>
      {manage && (
        <td className="pl-1">
          <Form method="POST">
            <div>
              <ActionButton colorCode="Alert" submit>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="name" value={t.name} />
                {"Delete"}
              </ActionButton>
            </div>
          </Form>
        </td>
      )}
    </tr>
  ));

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-2xl text-slate-200 text-center mb-4">Tournaments</h2>
      <div className="max-sm:min-h-[512px] sm:h-[512px] overflow-y-auto">
        <table className="table-fixed max-w-[100dvw]">
          <thead>
            <tr>
              <th className="w-40 sm:w-60"></th>
              <th className="hidden sm:block sm:w-24"></th>
              <th className="w-16"></th>
              {manage && <th className="w-16"></th>}
            </tr>
          </thead>
          <tbody>{leaguesButtons}</tbody>
        </table>
      </div>
      <div className="max-sm:my-4 ">
        <Pagination page={page} setPage={setPage} totalPages={maxPages} />
      </div>
    </div>
  );
};
