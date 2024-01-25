import { json, type ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  console.log(request);
  const tournamentId = params["id"];
  const apiUrl = process.env.API_URL;

  const update = await request.json();

  const result = await fetch(`${apiUrl}/league/${tournamentId}/live/timer`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });

  console.log(result);
  return json({});
};
