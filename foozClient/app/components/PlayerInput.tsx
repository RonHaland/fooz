import { useState, useEffect } from "react";
import { ActionButton } from ".";

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
    <div className="flex">
      <input
        type="text"
        value={value}
        name={`player-${number}`}
        onChange={onUpdate}
        onBlur={onBlur}
      ></input>
      <ActionButton colorCode="Alert" onClick={onDelete}>
        X
      </ActionButton>
    </div>
  );
};
