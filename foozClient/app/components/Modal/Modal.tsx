export type ModalProps = {
  children?: any;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal = ({ children, open, setOpen }: ModalProps) => {
  const close = () => setOpen(false);

  return (
    <>
      {open ? (
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
