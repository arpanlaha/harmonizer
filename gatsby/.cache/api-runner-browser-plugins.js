module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"App name","short_name":"App short name","description":"App description","start_url":"/","background_color":"#ffffff","theme_color":"#ffffff","display":"browser","icon":"static/logo.svg"},
    },{
      plugin: require('../node_modules/gatsby-plugin-offline/gatsby-browser.js'),
      options: {"plugins":[]},
    }]
