import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
} from "react";

type BaseButtonProps = {
  buttonText: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  href?: string;
  buttonProps?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
};
export const BaseButton = ({
  buttonText = "",
  className = "bg-sky-500 text-white",
  onClick = () => {},
  href,
  ...buttonProps
}: BaseButtonProps) => {
  const classes =
    "text-base font-medium rounded-lg py-3 px-7 disabled:bg-slate-300 disabled:text-slate-700 " +
    className;
  return !href ? (
    <button {...buttonProps} className={classes} onClick={onClick}>
      {buttonText}
    </button>
  ) : (
    <a className={classes} onClick={onClick} href={href}>
      {buttonText}
    </a>
  );
};
