import React from "react"
import CTA from "../components/CTA.js"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from '/src/components/Layout.js'
import { preToCodeBlock } from "mdx-utils"
import Code from '/src/components/CodeBlock.js'
import { graphql } from "gatsby"
import Beware from '/src/components/Beware.js'


const components = {
  pre: preProps => {
    const props = preToCodeBlock(preProps)
    if (props) {
      return <Code {...props} />
    } else {
      return <pre {...preProps} />
    }
  },
  warning: Beware,
};


export default (props) => {
  let mdx = props.pageContext.node;
  let children = props.children;
  console.log(props)
  console.log(mdx.frontmatter)
  return(
  <Layout>
    <CTA>
      <MDXProvider components={components}>
        <h1>{mdx.frontmatter.title}</h1>
        
        <p>✍️ by {mdx.frontmatter.author} -- Reading ⏱: {mdx.timeToRead} minutes </p>
        <MDXRenderer>{mdx.body}</MDXRenderer>
        {children}
      </MDXProvider>
    </CTA>
  </Layout>
  )
}
