import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { auth } from "~/utils/auth.server";

export const loader: LoaderFunction = () => redirect("/login");

export const action: ActionFunction = async ({ request }) => {
  return await auth.authenticate("discord", request);
};
