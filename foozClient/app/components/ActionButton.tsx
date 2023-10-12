import { useButtonStyles } from "~/hooks";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  submit?: boolean;
  children?: any;
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
  colorCode,
  submit = false,
}: Props) => {
  let className = useButtonStyles(colorCode);
  return (
    <button
      onClick={onClick}
      className={className}
      type={submit ? "submit" : "button"}
    >
      {children}
    </button>
  );
};
