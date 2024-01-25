import { forwardRef } from "react";
import { AltModal } from "./AltModal";
import { ActionButton } from "..";

type Props = {
  ref: React.RefObject<HTMLDialogElement>;
  handleConfirm?: () => void;
  submit?: boolean;
};

export const ConfirmationModal = forwardRef<HTMLDialogElement, Props>(
  function Modal({ handleConfirm, submit }: Props, ref) {
    const currentRef = ref as React.RefObject<HTMLDialogElement>;
    if (currentRef?.current) {
      currentRef?.current.close();
    }
    return (
      <AltModal ref={ref}>
        <div className="flex flex-col gap-4">
          <h3>Confirm</h3>
          <p>Are you sure?</p>
          <div className="w-full flex flex-row justify-between">
            <ActionButton
              submit={submit}
              onClick={handleConfirm}
              colorCode="Success"
            >
              Yes
            </ActionButton>
            <ActionButton
              onClick={() => currentRef.current?.close()}
              colorCode="Alert"
            >
              No
            </ActionButton>
          </div>
        </div>
      </AltModal>
    );
  }
);
