/* eslint-disable */
const path = require("path");

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Harmonizer",
        short_name: "Harmonizer",
        description: "Harmonize your melodies",
        start_url: "/",
        background_color: "#1a1e23",
        theme_color: "#1a1e23",
        display: "minimal-ui",
        icon: "static/logo.svg",
      },
    },
    "gatsby-plugin-offline",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-preload-fonts",
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        allExtensions: true,
        isTSX: true,
      },
    },
  ],
};
