import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import type { LeagueListItem } from "~/_types";
import { LeagueList } from "~/components/LeagueList";
import { createRef, useEffect, useState } from "react";
import type { DashboardContext } from "./dashboard";
import { LinkButton } from "~/components";
import { DeleteLeagueStatus } from "~/_types/deleteLeague";
import { AltModal } from "~/components/Modal/AltModal";
import { ConfirmationModal } from "~/components/Modal";
import { GetTokenFromRequest } from "~/utils/token.server";

const DashboardPage = () => {
  const { leagues } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { setButtons } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const [deleteStatus, setDeleteStatus] = useState<
    DeleteLeagueStatus | undefined
  >();

  const confirmDeleteRef = createRef<HTMLDialogElement>();

  const navButtons = (
    <>
      <LinkButton href="/dashboard/create">Create League</LinkButton>
    </>
  );
  useEffect(() => {
    setButtons(navButtons);
  }, []);

  useEffect(() => {
    console.log(actionData?.deleteStatus);
    setDeleteStatus(actionData?.deleteStatus);
    if (actionData?.deleteStatus.showPopup)
      confirmDeleteRef.current?.showModal();
    else {
      confirmDeleteRef.current?.close();
    }
    if (actionData?.deleteStatus.refresh) navigate(".");
  }, [actionData]);
  return (
    <div className="flex flex-col container mx-auto items-center pt-8">
      <LeagueList leagues={leagues as any} manage />
      <Form method="DELETE">
        <input type="hidden" name="id" value={deleteStatus?.id} />
        <input type="hidden" name="name" value={deleteStatus?.name} />
        <ConfirmationModal submit ref={confirmDeleteRef}></ConfirmationModal>
      </Form>
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

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method == "POST") {
    const fd = await request.formData();
    console.log(fd.get("id"));
    const deleteStatus = {
      showPopup: true,
      id: fd.get("id"),
      name: fd.get("name"),
    } as DeleteLeagueStatus;
    return { deleteStatus: deleteStatus };
  }
  if (request.method == "DELETE") {
    const token = GetTokenFromRequest(request);
    const fd = await request.formData();
    const url = process.env.API_URL;
    const result = await fetch(`${url}/league/${fd.get("id")}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    });
    console.log(result);
    return {
      deleteStatus: { showPopup: false, refresh: true } as DeleteLeagueStatus,
    };
  }

  return { deleteStatus: { showPopup: false } as DeleteLeagueStatus };
};
