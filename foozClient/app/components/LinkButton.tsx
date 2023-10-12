import { useButtonStyles } from "~/hooks";

type Props = {
  href: string;
  children?: any;
  colorCode?:
    | "Primary"
    | "Secondary"
    | "Info"
    | "Success"
    | "Alert"
    | "Warning";
};
export const LinkButton = ({ href, children, colorCode }: Props) => {
  let className = useButtonStyles(colorCode);
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};
