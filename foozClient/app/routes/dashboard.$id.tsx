import { Outlet, useLocation, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";
import type { DashboardContext } from "./dashboard";
import { BackButton } from "~/components/BackButton";

const DashboardLeaguePage = () => {
  const { setButtons } = useOutletContext<DashboardContext>();
  const location = useLocation();
  useEffect(() => {
    const navButtons = (
      <>
        <BackButton />
      </>
    );
    console.log(location);
    setButtons(navButtons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return <Outlet></Outlet>;
};

export default DashboardLeaguePage;
