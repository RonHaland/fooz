import { useMatches } from "@remix-run/react";
import type { loader as root } from "~/root";

export const useFeatures = () => {
    const rootData = useMatches().find((m) => m.id == "root")?.data as ReturnType<
    typeof root
  >;
  return rootData.Features
}