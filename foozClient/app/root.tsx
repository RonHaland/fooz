import { LiveReload, useSWEffect } from "@remix-pwa/sw";
import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindCssUrl from "~/styles/tailwind.css";
import { getFeatures } from "./utils/features";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwindCssUrl },
];

export const meta: MetaFunction = () => {
  return [{ title: "Fooz App" }, { name: "description", content: "Fooz app" }];
};

export default function App() {
  useSWEffect();

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-bl from-sky-100 to-indigo-300 dark:from-slate-700 dark:to-slate-950 text-slate-700 dark:text-slate-400 min-h-[100lvh]">
        <DndProvider
          backend={TouchBackend}
          options={{ enableMouseEvents: true }}
        >
          <Outlet />
        </DndProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const loader = ({}: LoaderFunctionArgs) => {
  return {
    Features: getFeatures(),
  };
};
