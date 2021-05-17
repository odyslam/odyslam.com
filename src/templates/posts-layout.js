import React from "react"
import CTA from "../components/CTA.js"
import { MDXProvider } from "@mdx-js/react"
import { MDXRenderer } from "gatsby-plugin-mdx";
import Layout from '/src/components/Layout.js'
import { preToCodeBlock } from "mdx-utils"
import Code from '/src/components/CodeBlock.js'
import { graphql } from "gatsby"
import Beware from '/src/components/Beware.js'
import { GatsbyImage } from "gatsby-plugin-image"



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
  return(
  <Layout>
    <CTA>
      <MDXProvider components={components}>
        <h1 className="text-center">{mdx.frontmatter.title}</h1>
        <p className="text-center mb-5">Published Date <span role="img" aria-label="calendar">📅 </span> {mdx.frontmatter.date} -- <span role="img" aria-label="writing">✍️ </span> by {mdx.frontmatter.author} -- Reading Time <span role="img" aria-label="clock">⏰ </span>: {mdx.timeToRead} minutes </p>
        {mdx.frontmatter.coverImage && <GatsbyImage className="postCoverImage" loading="eager" image={mdx.frontmatter.coverImage.childImageSharp.gatsbyImageData} alt={mdx.frontmatter.coverImageLegend}/>}
        <MDXRenderer className='prose'>{mdx.body}</MDXRenderer>
        {children}
      </MDXProvider>
    </CTA>
  </Layout>
  )
}
