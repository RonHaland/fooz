import { Link } from "@remix-run/react";
import { useButtonStyles } from "~/hooks";

type Props = {
  href: string;
  children?: any;
  disabled?: boolean;
  className?: string;
  outlined?: boolean;
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
  outlined,
  className,
  disabled,
}: Props) => {
  className = `${useButtonStyles(colorCode, disabled)} ${className}`;

  className = `${outlined ? "border border-slate-50/30" : ""} ${className} `;

  return !disabled ? (
    <Link to={href} className={className}>
      {children}
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
};
