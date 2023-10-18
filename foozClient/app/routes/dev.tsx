import { useEffect } from "react";
import { ActionButton } from "~/components";
import { useWebSocket } from "~/hooks/useWebSocket";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "@remix-run/react";

const DevPage = () => {
  const { apiUrl } = useLoaderData<typeof loader>();
  const wsBaseUrl = apiUrl.replace("https", "wss");
  const wsConnectionEndpoint = `${wsBaseUrl}/tournament/de6bd0fa-a69f-42c1-a36b-8954b4c8f3b7/live`;
  const { connect, setOnMessage } = useWebSocket(wsConnectionEndpoint);

  useEffect(() => {
    const onMessage = (a: string) => {
      console.log(a);
    };
    setOnMessage(() => onMessage);
  }, []);

  return (
    <div className="container mx-auto">
      <div>
        <div className="flex flex-col justify-center items-center h-96">
          <ActionButton onClick={connect}>Connect</ActionButton>
        </div>
      </div>
    </div>
  );
};

export default DevPage;

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  return { apiUrl: process.env.API_URL ?? "" };
};
