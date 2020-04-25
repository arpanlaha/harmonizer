const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---cache-caches-gatsby-plugin-offline-app-shell-js": hot(preferDefault(require("/datadrive/harmonizer/gatsby/.cache/caches/gatsby-plugin-offline/app-shell.js"))),
  "component---src-pages-index-tsx": hot(preferDefault(require("/datadrive/harmonizer/gatsby/src/pages/index.tsx")))
}

