const path = require("path")

exports.createPages = async ({ graphql, actions, reporter }) => {
  // Destructure the createPage function from the actions object
  const { createPage } = actions

  const result = await graphql(`
  query  {
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
          coverImage {
            childImageSharp {
              gatsbyImageData
            }
          }
          coverImageLegend
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
  `)
  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query')
  }

  // Create blog post pages.
  const posts = result.data.allMdx.nodes
  // reporter.info(JSON.stringify(posts))

  // you'll call `createPage` for each result
  
  const nodeMap = {};

  posts.forEach( node  => {
    if(node.slug == 'about'){
      reporter.info("I found the about page")
      nodeMap.about = 1;
    }
    else if (node.fileAbsolutePath.includes("posts")){
      reporter.info(`Creating post with name ${node.slug}`)
      let tags = node.frontmatter.tags;
      let category = node.frontmatter.category
      nodeMap[category] = tags
      createPage({      
        // This is the slug you created before
        // (or `node.frontmatter.slug`)

        path: `blog/${node.slug}`,
        // This component will wrap our MDX content
        component: path.resolve(`./src/templates/posts-layout.js`),
        // You can use the values in this context in
        // our page layout component
        context: { node, nodeMap },
      })
    }
  })
}