import { LinkButton } from "~/components";
import { ImagePreview } from "~/components/ImagePreview";
import { useFeatures } from "~/hooks/useFeatures";

export default function Index() {
  const features = useFeatures();
  return (
    <div className="container mx-auto">
      <ImagePreview />
      <div className="flex flex-col items-center">
        <h1 className="text-4xl">Foosball</h1>
        <div className="flex flex-row gap-4 p-1 my-2">
          {/* <LinkButton href="/timer" colorCode="Secondary">
          Timer
        </LinkButton> */}
          <LinkButton href="/league" colorCode="Primary">
            Leagues
          </LinkButton>
          {features["Ranked"] && (
            <LinkButton href="/ranked">Ranked games</LinkButton>
          )}
          <LinkButton href="/dashboard" colorCode="Secondary">
            Dashboard
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
