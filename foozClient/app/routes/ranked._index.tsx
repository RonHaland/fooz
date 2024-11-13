import { MetaFunction, json, useLoaderData } from "@remix-run/react";
import { FaRankingStar } from "react-icons/fa6";
import { RankedPlayer } from "~/_types";
import { LinkButton, RankedRow, RankedBoard } from "~/components";
import { requireFeature } from "~/utils/features";

const RankedPage = () => {
  const { players } = useLoaderData<typeof loader>();

  const playerTable = players
    .sort((a, b) => b.rating - a.rating)
    .map((p, i) => <RankedRow key={i} ind={i + 1} player={p}></RankedRow>);
  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="text-4xl md:text-[10rem] flex flex-col items-center text-slate-100 text-center mt-4 md:mt-8">
          <FaRankingStar />
          <span className="text-2xl md:text-7xl">Ranked games</span>
        </div>
        <div className="flex flex-row gap-2 my-5">
          <LinkButton href="./newmatch">New Match</LinkButton>
          <LinkButton href="./addplayer">Add Player</LinkButton>
          <LinkButton href="" colorCode="Secondary">
            Match history
          </LinkButton>
        </div>
        <div className="w-80 sm:w-[50lvw] xl:w-[40rem] bg-sky-950 p-8 rounded">
          <RankedBoard>{playerTable}</RankedBoard>
        </div>
      </div>
    </>
  );
};

export default RankedPage;

export const meta: MetaFunction = () => {
  return [{ title: "Ranked Games" }];
};

export const loader = async () => {
  requireFeature("Ranked");

  const url = `${process.env.API_URL}/Ranked/Players`;
  const response = await fetch(url);
  const players = (await response.json()) as RankedPlayer[];

  return json({ players });
};
