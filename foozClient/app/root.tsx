import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import { getFeatures } from "./utils/features";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const links: LinksFunction = () => [];

export const meta: MetaFunction = () => {
  return [{ title: "Fooz App" }, { name: "description", content: "Fooz app" }];
};

export default function App() {
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
          backend={HTML5Backend}
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

// eslint-disable-next-line no-empty-pattern
export const loader = ({}: LoaderFunctionArgs) => {
  return {
    Features: getFeatures(),
  };
};
