import { json, type ActionFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: ActionFunctionArgs) => {
  const playerCount = params["playerCount"];
  const apiUrl = process.env.API_URL;

  const result = await fetch(
    `${apiUrl}/League/MatchCountOptions?PlayerCount=${playerCount}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await result.json();
  return json([...data]);
};
