import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import { ActionButton } from "~/components";
import { auth } from "~/utils/auth.server";
import { GetTokenFromRequest } from "~/utils/token.server";

const DashboardPage = () => {
  const [navButtons, setNavButtons] = useState(<></>);
  return (
    <div className="flex flex-col">
      <header className="bg-zinc-950/30  shadow-black/30 shadow p-4 sm:p-8 flex flex-row justify-between items-center">
        <Link to={"/dashboard"}>
          <h1 className="text-2xl sm:text-4xl text-slate-300 font-medium">
            DASHBOARD
          </h1>
        </Link>
        <div></div>
        <div className="flex flex-row gap-2">
          {navButtons}
          <Form method="POST" action="/logout">
            <ActionButton submit colorCode="Secondary">
              Log out
            </ActionButton>
          </Form>
        </div>
      </header>
      <main>
        <Outlet
          context={
            {
              setButtons: (btns: JSX.Element) => {
                if (navButtons != btns) setNavButtons(btns);
              },
            } as DashboardContext
          }
        />
      </main>
    </div>
  );
};

export default DashboardPage;

export type DashboardContext = {
  setButtons: (btns: JSX.Element) => void;
};
export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const token = GetTokenFromRequest(request);
  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  let isAdmin = false;
  try {
    const rolesResponse = await fetch(`${process.env.API_URL}/user/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rolesResult = (await rolesResponse.json()) as string[];
    isAdmin = rolesResult.includes("admin");
  } catch (error) {
    console.log(error);
  }
  return json({ user, token, isAdmin });
};
