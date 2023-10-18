import type { MetaFunction } from "@remix-run/node";
import { LinkButton } from "~/components";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl">Nu ska det foozast</h1>
      <div className="flex flex-row gap-4 p-1 my-2">
        <LinkButton href="/timer" colorCode="Secondary">
          Timer
        </LinkButton>
        <LinkButton href="/tournament" colorCode="Secondary">
          Tournaments
        </LinkButton>
      </div>
    </div>
  );
}
