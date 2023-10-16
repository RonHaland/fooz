import type { ModalProps } from ".";
import { ModalBox } from ".";
import { ActionButton } from "..";

type Props = ModalProps & {
  infoTitle?: string;
  infoMessage?: string;
};
export const InfoBox = ({
  open,
  setOpen,
  children,
  infoTitle,
  infoMessage,
}: Props) => {
  const close = () => setOpen(false);
  return (
    <ModalBox open={open} setOpen={setOpen}>
      <div className="flex flex-col justify-center gap-4 text-slate-950">
        {infoTitle && <h2 className="text-center text-2xl">{infoTitle}</h2>}
        {infoMessage && <p className="">{infoMessage}</p>}
        {children}
        <ActionButton onClick={close}>Close</ActionButton>
      </div>
    </ModalBox>
  );
};
