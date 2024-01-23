import { LinkButton } from "~/components";

export default function Index() {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl">Nu ska det foozast</h1>
      <div className="flex flex-row gap-4 p-1 my-2">
        {/* <LinkButton href="/timer" colorCode="Secondary">
          Timer
        </LinkButton> */}
        <LinkButton href="/league" colorCode="Secondary">
          Leagues
        </LinkButton>
        <LinkButton href="/dashboard" colorCode="Secondary">
          Dashboard
        </LinkButton>
      </div>
    </div>
  );
}
