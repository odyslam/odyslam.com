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
  `);

  let categoriesDepth = {};
  let previousPostByCategory = {};
  let graphNodes = [];
  let graphEdges = [];
  let tagNodesList = [];
  let categoriesPostsNodes = {};
  let tagNodes = [];
  let tagEdges = [];
  let tagEdgesChain = {};
  let categoriesEdgesChain = {};
  const tagsImages = {
    1721: "asdf",
    futurism: "asdff",
    society: "asfdsf",
    2021: "2021",
  };
  let categoriesNodes = {};
  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query');
  }

  // Create blog post pages.
  const posts = result.data.allMdx.nodes;
  const nodes = result.data.allMdx.nodes;
  nodes.forEach((node) => {
    let id = node.id;
    let path = `blog/${node.slug}`;
    if (path.includes("blog") && path != "/blog/" && path != "blog/about") {
      console.log(path);
      let { category, tags, title, date, coverImage, excerpt } =
        node.frontmatter;
      console.log(date);
      // let coverImgSrc = coverImage.childImageSharp.gatsbyImageData.images.fallback.src;
      let coverImgSrc = "asdf";
      // reporter.info(JSON.stringify(coverImage))
      let timeToRead = node.timeToRead;
      let rawhtml = `<div><h3 class="mt-0 tracking-widest text-center text-black" >${title}--</h3> \
        <p class="text-black mx-5 font-serif" >Reading ⏰ ${timeToRead}m | Date 📅 ${date}</p> \
        <p class="text-black mx-5 font-serif" >Tags: ${tags} </p> \
        <p class="text-black mx-5 font-serif">${excerpt}<p></div>`;

      if (categoriesDepth[category] == null) {
        categoriesDepth[category] = 0;
        categoriesPostsNodes[category] = [];
        categoriesEdgesChain[category] = [];
        previousPostByCategory[category] = `blog/${category}`;
        console.log(previousPostByCategory);
      } else {
        categoriesDepth[category] = categoriesDepth[category] + 1;
        console.log("Category found!");
      }

      let level = categoriesDepth[category] + 1;
      let postNode = {
        id: path,
        label: title,
        title: rawhtml,
        level: level,
        margin: 10,
        shape: "circularImage",
        image: coverImgSrc,
      };
      let postEdge = { from: previousPostByCategory[category], to: path };
      previousPostByCategory[category] = path;

      categoriesPostsNodes[category].push(postNode);
      categoriesEdgesChain[category].push(postEdge);

      if (tags) {
        tags.forEach((tag) => {
          if (!tagNodesList.includes(tag)) {
            let tagNode = {
              id: `/blog/tags/${tag}`,
              label: tag,
              title: tag,
              level: level,
              margin: 10,
              shape: "circularImage",
              image: tagsImages[tag],
            };
            tagNodes.push(tagNode);
            tagEdgesChain[tag] = { from: `/blog/tags/${tag}`, to: path };
            tagNodesList.push(tag);
          }
          let tagEdge = { from: `/blog/tags/${tag}`, to: path };
          tagEdges.push(tagEdge);
        });
      }
    }
    // for every category ,create a list of posts which one should point to another.
  });

  graphNodes = graphNodes.concat(tagNodes);
  graphEdges = graphEdges.concat(tagEdges);
  console.log(categoriesEdgesChain, categoriesPostsNodes);
  console.log(categoriesDepth);
  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query');
  }

  // Create blog post pages.
  // const posts = result.data.allMdx.nodes
  // reporter.info(JSON.stringify(posts))

  // you'll call `createPage` for each result

  const nodeMap = {};
  reporter.info(result);
  posts.forEach((node) => {
    if (node.slug == "about") {
      reporter.info("I found the about page");
      nodeMap.about = 1;
    } else if (node.slug == "blog") {
      createPage({
        path: "blog",
        component: path.resolve("./src/templates/MdxPage.js"),
        context: {
          categoriesEdgesChain: categoriesEdgesChain,
          categoriesPostsNodes: categoriesPostsNodes,
        },
      });
    } else if (node.fileAbsolutePath.includes("posts")) {
      reporter.info(`Creating post with name ${node.slug}`);
      let tags = node.frontmatter.tags;
      let category = node.frontmatter.category;
      nodeMap[category] = tags;
      createPage({
        // This is the slug you created before
        // (or `node.frontmatter.slug`)
        path: `blog/${node.slug}`,
        // This component will wrap our MDX content
        component: path.resolve(`./src/templates/posts-layout.js`),
        // You can use the values in this context in
        // our page layout component
        context: { node, nodeMap },
      });
    }
  });
};
