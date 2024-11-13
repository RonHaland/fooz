import { useNavigation } from "@remix-run/react";
import { ImSpinner } from "react-icons/im";

export const LoadingIndicator = () => {
  const navigation = useNavigation();

  if (navigation.state === "idle") {
    return <></>;
  }

  return (
    <div className="bg-slate-950/30 backdrop-blur-sm fixed inset-0 flex flex-col justify-center">
      <div className="rounded-xl bg-slate-600/70 mx-auto w-20 h-20 flex flex-col justify-center items-center">
        <ImSpinner className="text-slate-400/50 text-4xl animate-spin duration-700" />
      </div>
    </div>
  );
};
