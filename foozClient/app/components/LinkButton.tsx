import { useButtonStyles } from "~/hooks";

type Props = {
  href: string;
  children?: any;
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
export const LinkButton = ({
  href,
  children,
  colorCode = "Primary",
  className,
  disabled,
}: Props) => {
  className = `${useButtonStyles(colorCode, disabled)} ${className}`;
  return !disabled ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
};
