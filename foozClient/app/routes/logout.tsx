import type { ActionFunction } from "@remix-run/node";
import { auth } from "~/utils/auth.server";

export const action: ActionFunction = ({ request }) => {
  return auth.logout(request, { redirectTo: "/login" });
};
