import { Form } from "@remix-run/react";
import { ActionButton } from "~/components";
import { FaDiscord } from "react-icons/fa6/index";

const LoginPage = () => {
  return (
    <div className="grid place-content-center place-items-center h-screen -mt-1 grid-rows-2 ">
      <div className="flex flex-col gap-20 rounded-xl p-16 pt-24 shadow-2xl shadow-black">
        <h1 className="text-4xl text-slate-200 text-center">Login</h1>
        <Form action="/auth/discord" method="POST">
          <ActionButton colorCode="Secondary" submit>
            <span className="inline-flex items-center gap-2">
              Login with Discord{" "}
              <span className="text-2xl">
                <FaDiscord />
              </span>
            </span>
          </ActionButton>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
