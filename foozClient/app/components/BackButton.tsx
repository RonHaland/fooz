import { useLocation, useNavigate } from "@remix-run/react";
import { ActionButton } from ".";
import { useEffect, useState } from "react";

export const BackButton = () => {
  const navigate = useNavigate();
  const [href, setHref] = useState("");

  const location = useLocation();
  useEffect(() => {
    const loc = location.pathname.endsWith("/")
      ? `${location.pathname}..`
      : `${location.pathname}/..`;
    setHref(loc);
    console.log(loc);
  }, [location]);
  return (
    <ActionButton onClick={() => navigate(href)} colorCode="Alert">
      Back
    </ActionButton>
  );
};
