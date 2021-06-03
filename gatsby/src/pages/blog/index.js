import * as React from "react"
import Layout from '../../components/Layout.js'
import { graphql } from "gatsby"
import Footer from "../../components/Footer.js"


const IndexPage = (props) => {
  console.log(props)
  return (
        <Layout sideNavheight="h-screen">
            <main>
            </main>
            <Footer/>
        </Layout>
  )
}

export default IndexPage



export const query = graphql`
 query categories {
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