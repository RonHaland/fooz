import type { ModalProps } from "./Modal";
import { Modal } from "./Modal";

type Props = ModalProps;

export const ModalBox = ({ children, open, setOpen }: Props) => {
  const close = () => setOpen(false);
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="w-full h-full flex flex-row justify-center">
        <div className="flex flex-col justify-center">
          {
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              className="rounded-lg bg-slate-500 p-1 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex flex-row justify-end">
                <button
                  className=" text-slate-950 bg-zinc-100 hover:bg-zinc-300 w-4 h-4 text-center rounded-full align-middle text-sm font-normal hover:font-semibold leading-3 cursor-pointer"
                  onClick={close}
                >
                  x
                </button>
              </div>
              <div className="px-6">{children}</div>
            </div>
          }
        </div>
      </div>
    </Modal>
  );
};
