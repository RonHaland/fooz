import { type ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  console.log(request);
  const tournamentId = params["id"];
  const apiUrl = process.env.API_URL;

  const result = await fetch(`${apiUrl}/league/${tournamentId}/live/donut`, {
    method: "POST",
  });

  console.log(result);

  return {};
};
