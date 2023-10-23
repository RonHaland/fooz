import { Form } from "@remix-run/react";
import { ActionButton, LinkButton } from "~/components";
import { FaDiscord, FaHouse, FaKey } from "react-icons/fa6/index";

const LoginPage = () => {
  return (
    <div className="grid place-content-center place-items-center h-screen -mt-1 grid-rows-2 ">
      <div className="flex flex-col gap-20 rounded-xl p-16 pt-24 shadow-2xl shadow-black">
        <div className="flex flex-col items-center gap-2">
          <span className="text-center text-amber-400 text-6xl ">
            <FaKey />
          </span>
          <h1 className="text-4xl text-slate-200 text-center">Login</h1>
        </div>

        <div className="flex flex-col gap-6">
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
          <span className="text-lg text-center text-slate-200">Or</span>
          <LinkButton
            href="/"
            colorCode="Success"
            className="text-center w-fit self-center"
          >
            <span className="inline-flex items-center gap-2">
              Home{" "}
              <span className="text-xl">
                <FaHouse />
              </span>
            </span>
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
