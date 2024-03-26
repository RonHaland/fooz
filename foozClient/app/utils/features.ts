import { redirect } from "@remix-run/node";

export const getFeatures = () => {
  const mappedFeatures = Object.entries(process.env)
    .filter((k) => k[0].startsWith("FT_") && k[1] == "true")
    .map((k) => ([k[0].substring(3),true]));
    const features = Object.fromEntries(mappedFeatures) as {[key:string]:boolean};
    return features
}

export const requireFeature = (featureName: string) => {
  if (process.env.NODE_ENV != "production") console.log(`Feature not enabled ${featureName}`);
  if (!getFeatures()[featureName]) throw redirect("/");
}