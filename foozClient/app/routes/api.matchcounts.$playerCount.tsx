import { json, type ActionFunctionArgs } from "@remix-run/node";

export const loader = async ({ request, params }: ActionFunctionArgs) => {
  console.log(request);
  const playerCount = params["playerCount"];
  const apiUrl = process.env.API_URL;

  const result = await fetch(
    `${apiUrl}/League/MatchCountOptions?PlayerCount=${playerCount}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  var data = await result.json();
  return json([...data]);
};
