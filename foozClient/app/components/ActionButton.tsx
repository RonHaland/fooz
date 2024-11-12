import { useButtonStyles } from "~/hooks";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  submit?: boolean;
  children?: React.JSX.Element | string;
  disabled?: boolean;
  className?: string;
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
  className,
  submit = false,
}: Props) => {
  className = `${useButtonStyles(colorCode, disabled)} ${className}`;
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
