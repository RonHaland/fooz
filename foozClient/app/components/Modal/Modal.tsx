export type ModalProps = {
  children?: JSX.Element | string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal = ({ children, open, setOpen }: ModalProps) => {
  const close = () => setOpen(false);

  return (
    <>
      {open ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-sm"
          onClick={close}
        >
          {children}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
