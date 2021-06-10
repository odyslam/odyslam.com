const path = require("path");

exports.createPages = async ({ graphql, actions, reporter }) => {
  // Destructure the createPage function from the actions object
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allMdx {
        nodes {
          fileAbsolutePath
          slug
          body
          frontmatter {
            date
            title
            tags
            category
            author
          }
          timeToRead
          id
          wordCount {
            paragraphs
            sentences
            words
          }
        }
      }
    }
  `);
  reporter.info(result);
  const posts = result.data.allMdx.nodes;

  posts.forEach((node) => {
    if (node.slug == "about") {
      reporter.info("I found the about page");
    } 
    // else if (node.slug == "blog") {
    //   createPage({
    //     path: "blog",
    //     component: path.resolve("./src/templates/MdxPage.js"),
    //     context: {
    //       // categoriesEdgesChain: categoriesEdgesChain,
    //       // categoriesPostsNodes: categoriesPostsNodes,
    //     },
    //   });
    // } 
    else if (node.fileAbsolutePath.includes("posts")) {
      reporter.info(`Creating post with name ${node.slug}`);
      let tags = node.frontmatter.tags;
      let category = node.frontmatter.category;
      createPage({
        // This is the slug you created before
        // (or `node.frontmatter.slug`)
        path: `blog/${node.slug}`,
        // This component will wrap our MDX content
        component: path.resolve(`./src/templates/posts-layout.js`),
        // You can use the values in this context in
        // our page layout component
        context: node
      });
    }
  });
};
