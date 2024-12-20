import { MouseEventHandler, forwardRef } from "react";

type Props = {
  children?: JSX.Element | string;
  ref: React.RefObject<HTMLDialogElement>;
};

export const AltModal = forwardRef<HTMLDialogElement, Props>(function Modal(
  { children }: Props,
  ref
) {
  const close = () => {
    const currentRef = ref as React.RefObject<HTMLDialogElement>;
    if (currentRef?.current) {
      currentRef?.current.close();
    }
  };
  const stopPropagation: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };
  return (
    <dialog
      ref={ref}
      className="backdrop:bg-zinc-900/50 backdrop:backdrop-blur-sm bg-transparent"
    >
      {
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          onClick={stopPropagation}
          className="rounded-lg bg-slate-500 p-1 shadow-lg"
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
      {
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className="fixed inset-0 bg-gradient-to-bl -z-10 from-fuchsia-700/5 to-indigo-500/10 opacity-30"
          onClick={close}
        ></div>
      }
    </dialog>
  );
});
