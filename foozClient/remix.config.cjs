/** @type {import('@remix-pwa/dev').WorkerConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [/^react-icons/],
  future: {
    v3_relativeSplatPath: true,
    v3_fetcherPersist: true,
  },
  tailwind: true,
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
