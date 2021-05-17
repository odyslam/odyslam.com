import * as React from "react"
import Layout from '../components/Layout.js'
import { graphql } from "gatsby"


const IndexPage = (props) => {
  console.log(props)
  return (
        <Layout>
            <main>

            </main>
        </Layout>
  )
}

export default IndexPage



export const query = graphql`
 query SITE_INDEX_QUERY {
 allMdx(
 sort: { fields: [frontmatter___date], order: DESC }
 ) {
 nodes {
 id
 excerpt(pruneLength: 250)
 frontmatter {
 title
 date
 }
 }
 }
 }
`