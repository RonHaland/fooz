import { useEffect, useState } from "react";
import { useButtonStyles } from "~/hooks";

type props = {
  disabled?: boolean;
  className?: string;
  onColor?: "Primary" | "Secondary" | "Info" | "Success" | "Alert" | "Warning";
  offColor?: "Primary" | "Secondary" | "Info" | "Success" | "Alert" | "Warning";
  onToggle?: (newState: boolean) => void;
  value?: boolean;
  name?: string;
};

export const ToggleSwitch = ({
  onColor = "Primary",
  offColor = "Info",
  disabled = false,
  className,
  onToggle = () => {},
  value = false,
  name,
  ...ariaAttributes
}: props & React.AriaAttributes) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    onToggle(state);
  }, [state]);

  const getClassState = () => {
    let color = onColor;
    if (!state) {
      color = offColor;
    }
    return `${useButtonStyles(color, disabled, "p-1")} ${className}`;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((s) => !s);
  };
  const handleKeypress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case " ":
      case "Enter":
        setState((s) => !s);
    }
  };

  return (
    <>
      <input type="hidden" name={name} value={state.toString()}></input>
      <div
        tabIndex={0}
        className={`${getClassState()} w-10 h-6 rounded-xl flex flex-row items-center justify-start focus:outline focus:outline-slate-100`}
        onKeyDown={handleKeypress}
        onMouseDown={handleClick}
        role="switch"
        aria-label="switch"
        aria-checked={state}
        {...ariaAttributes}
      >
        <div
          className={`rounded-full bg-slate-200 h-4 w-4 transition-all ease-linear duration-150 pointer-events-none ${
            state ? "translate-x-4" : ""
          }`}
        ></div>
      </div>
    </>
  );
};
