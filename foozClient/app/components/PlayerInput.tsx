import { useState, useEffect } from "react";
import { ActionButton } from ".";
import { FaCross, FaIcons, FaX } from "react-icons/fa6";

type Props = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onDelete?: () => void;
  number: number;
  initialValue?: string;
};

export const PlayerInput = ({
  onChange,
  onDelete,
  number,
  initialValue,
}: Props) => {
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const onUpdate = (e: React.FocusEvent<HTMLInputElement>) => {
    onChange?.(e);
    setValue(e.target.value);
  };

  const onBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (value == "") {
      onDelete?.();
    }
  };
  return (
    <div className="flex relative w-full">
      <input
        type="text"
        className="rounded p-2 pr-10 focus-within:outline focus-within:outline-orange-600 bg-transparent border-slate-200 border-2 w-full"
        value={value}
        name={`player-${number}`}
        onChange={onUpdate}
        onBlur={onBlur}
      ></input>
      <div
        className="absolute text-sm text-slate-100/80 rounded-full border border-slate-200/50 p-1 right-2 top-[50%] translate-y-[-50%]"
        onClick={onDelete}
      >
        <FaX></FaX>
      </div>
    </div>
  );
};
