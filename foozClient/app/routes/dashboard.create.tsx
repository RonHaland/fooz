import { ActionFunction } from "@remix-run/node";
import { Form, useOutletContext } from "@remix-run/react";
import { ChangeEvent, useEffect, useState } from "react";
import { ActionButton } from "~/components";
import { DashboardContext } from "./dashboard";
import { CreateLeagueFrom } from "~/_types/createLeagueFrom";
import { PlayerInput } from "~/components/PlayerInput";

const CreateLeague = () => {
  const { setButtons } = useOutletContext<DashboardContext>();
  const [formState, setFormState] = useState<CreateLeagueFrom>({
    name: "",
    players: [],
    matchCount: 0,
  });
  const [matchCountOptions, setmatchCountOptions] = useState<JSX.Element[]>([]);
  const [playerInputs, setPlayerinputs] = useState<JSX.Element>();

  var buttons = <></>;
  useEffect(() => {
    setButtons(buttons);
  }, []);

  useEffect(() => {
    const fetchMatchCounts = async () => {
      const fetchResult = await fetch(
        `/api/matchcounts/${formState.players?.length ?? 0}`
      );
      const data = (await fetchResult.json()) as number[];

      var options = data.map((d, i) => (
        <option key={i} value={d}>
          {d}
        </option>
      ));
      setmatchCountOptions(options);
    };

    fetchMatchCounts();
  }, [formState.players?.length]);

  useEffect(() => {
    const updatePlayer = (val: string, n: number) => {
      const newPlayerArray = [
        ...formState.players.slice(0, n),
        val,
        ...formState.players.slice(n + 1),
      ];

      setFormState({
        ...formState,
        players: newPlayerArray,
      });
    };

    const removePlayer = (n: number) => {
      console.log(formState.players);
      console.log(formState.players[n]);
      const newPlayerArray = [...formState.players];
      newPlayerArray.splice(n, 1);
      console.log(newPlayerArray);

      setFormState({
        ...formState,
        players: newPlayerArray,
      });
    };

    const inputs = (
      <div className="flex flex-col">
        <label>Players: </label>
        {formState.players.concat([""]).map((p, i) => {
          return (
            <PlayerInput
              number={i}
              key={i}
              onChange={(e) => updatePlayer(e.target.value, i)}
              onDelete={() => removePlayer(i)}
              initialValue={formState.players[i]}
            ></PlayerInput>
          );
        })}
      </div>
    );

    setPlayerinputs(inputs);
  }, [formState]);

  const getFormParams = () => {
    return `./?name=${formState.name}`;
  };

  const onSelectedMatchCountChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormState({ ...formState, matchCount: parseInt(e.target.value ?? "0") });
  };

  return (
    <>
      <Form method="post">
        <div className="flex flex-row justify-center">
          <div className="flex flex-col items-center gap-2">
            <label>
              Name:{" "}
              <input
                type="text"
                id="Name"
                name="Name"
                value={formState?.name}
                onChange={(v) =>
                  setFormState({ ...formState, name: v.target.value })
                }
              ></input>
            </label>
            {playerInputs}
            <select
              name="matchCount"
              onChange={onSelectedMatchCountChange}
              value={formState.matchCount}
            >
              {matchCountOptions}
            </select>
            <ActionButton submit colorCode="Success">
              Create
            </ActionButton>
          </div>
        </div>
      </Form>
    </>
  );
};

export default CreateLeague;

export const action: ActionFunction = ({}) => {
  console.log("object");
  return {};
};
