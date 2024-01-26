import { redirect, useNavigate } from "@remix-run/react";
import type { LoaderFunctionArgs } from "react-router";
import { useFeatures } from "~/hooks/useFeatures";
import { getFeatures } from "~/utils/features";

const RankedPage = () => {
  const features = useFeatures();
  const navigate = useNavigate();
  if (!features["Ranked"]) navigate("/");
  return <></>;
};

export default RankedPage;

export const loader = ({ }: LoaderFunctionArgs) => {
  if (!getFeatures()["Ranked"]) throw redirect("/");
  return {};
};
