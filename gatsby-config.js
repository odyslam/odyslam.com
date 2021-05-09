module.exports = {
  siteMetadata: {
    title: "odyslam.com",
    description: "Persona"
  },
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    `gatsby-remark-images`,
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "G-4K0C4J1MP6",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: `${__dirname}/src/images/icon.png`,
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images/`,
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/pages/`,
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/src/posts/`,
      },
      __key: "posts",
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        defaultLayouts: {
          // posts: require.resolve("./src/templates/posts-layout.js"),
          pages: require.resolve("./src/templates/MdxPage.js")
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
        ],
      },
    },
  ],
};
