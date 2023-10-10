import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEventHandler,
} from "react";
import { BaseButton } from "./BaseButton";

type Props = {
  buttonText: string;
  onClick?: MouseEventHandler<HTMLElement>;
};

export const PrimaryButton = ({
  buttonText,
  onClick,
  ...buttonProps
}: Props &
  DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) => {
  return (
    <BaseButton {...buttonProps} buttonText={buttonText} onClick={onClick} />
  );
};
