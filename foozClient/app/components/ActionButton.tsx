import { useButtonStyles } from "~/hooks";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  submit?: boolean;
  children?: any;
  disabled?: boolean;
  colorCode?:
    | "Primary"
    | "Secondary"
    | "Info"
    | "Success"
    | "Alert"
    | "Warning";
};
export const ActionButton = ({
  onClick,
  children,
  colorCode = "Primary",
  disabled,
  submit = false,
}: Props) => {
  let className = useButtonStyles(colorCode, disabled);
  return (
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      type={submit ? "submit" : "button"}
    >
      {children}
    </button>
  );
};
