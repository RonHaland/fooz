import { createRef, useState } from "react";
import { ActionButton } from "~/components";
import { InfoBox } from "~/components/Modal/InfoBox";
import { AltModal } from "~/components/Modal/AltModal";

const DevPage = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const dialogRef = createRef<HTMLDialogElement>();
  const toggleOpen2 = () => {
    if (dialogRef?.current) {
      dialogRef?.current.showModal();
    }
  };
  return (
    <div className="container mx-auto">
      <div>
        <div className="flex flex-col justify-center items-center h-96">
          <ActionButton onClick={toggleOpen}>Open</ActionButton>
          <ActionButton onClick={toggleOpen2}>Open2</ActionButton>
        </div>
      </div>
      <AltModal ref={dialogRef}>HELLO!</AltModal>
      <InfoBox
        open={open}
        setOpen={setOpen}
        infoTitle="Title"
        infoMessage="This is a message"
      ></InfoBox>
    </div>
  );
};

export default DevPage;
