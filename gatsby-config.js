module.exports = {
  siteMetadata: {
    title: "MasterCurrency",
    description:
      "Currency conversion web application using exchangeratesapi.io API",
    author: "Irvin Ives Lau",
    url: "https://www.irviniveslau.com",
    social: {
      twitter: "irviniveslau",
      instagram: "irvin.dev",
      email: "lauirvin98@gmail.com"
    },
    imageShare: "./src/media/mastercurrency.png"
  },
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/src/`
      }
    }
  ]
};
