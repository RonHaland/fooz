import type { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { ImageHeader } from "~/components/ImageHeader";
import { PrimaryButton } from "~/components/PrimaryButton";

const Create = () => {
  return (
    <div className="container mx-auto bg-slate-300 dark:bg-slate-800 h-full">
      <ImageHeader
        src="/images/foosHeader.jpg"
        alt="blurred people engaged in an exciting foosball game"
        text="Foosball"
      />
      <div className="mx-4 my-8 flex justify-center">
        <Form method="post">
          <PrimaryButton buttonText="Create" type="submit" />
        </Form>
      </div>
    </div>
  );
};

export default Create;

export const action: ActionFunction = ({
  params,
  request,
}: ActionFunctionArgs) => {
  return ["recieved"];
};
