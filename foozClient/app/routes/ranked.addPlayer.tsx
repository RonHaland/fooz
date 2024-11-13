import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, MetaFunction, json } from "@remix-run/react";
import { useState } from "react";
import { FaPersonFalling } from "react-icons/fa6";
import { ActionButton } from "~/components";
import { requireFeature } from "~/utils/features";
import { GetTokenFromRequest } from "~/utils/token.server";

const RankedAddPlayerPage = () => {
  const [name, setName] = useState("");
  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="text-[10rem] flex flex-col items-center text-slate-400 text-center mt-8">
          <FaPersonFalling />
          <span className="text-7xl">Add Ranked Player</span>
        </div>
        <Form method="POST">
          <div className="flex flex-col gap-2 my-10">
            <label htmlFor="name">Name: </label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              className="rounded p-2 pr-10 focus-within:outline focus-within:outline-orange-600 bg-transparent border-slate-200 border-2 w-full"
              onChange={(v) => setName(v.target.value)}
            ></input>
            <ActionButton submit colorCode="Success">
              Add Player
            </ActionButton>
          </div>
        </Form>
      </div>
    </>
  );
};

export default RankedAddPlayerPage;

export const meta: MetaFunction = () => {
  return [{ title: "Add Ranked Player" }];
};

export const loader = async () => {
  requireFeature("Ranked");

  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const token = GetTokenFromRequest(request);
  const errors: string[] = [];

  const name = formData.get("name")?.toString() ?? "";
  if (name.length < 3) {
    errors.push("Name is too short");
    return json({ errors });
  }
  const apiUrl = process.env.API_URL;
  const result = await fetch(`${apiUrl}/Ranked/Player`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: `"${name}"`,
  });

  if (result.ok) throw redirect("/Ranked");

  return json({ errors });
};
