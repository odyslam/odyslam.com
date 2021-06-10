import * as React from "react"
import Layout from '../../components/Layout.js'
import { graphql } from "gatsby"
import Footer from "../../components/Footer.js"
import GraphMenu from "../../components/GraphMenu.js"

const IndexPage = (props) => {
  return (
        <Layout sideNavheight="h-screen">
            <main>
              <GraphMenu height={"h-screen"}></GraphMenu>
            </main>
            <Footer/>
        </Layout>
  )
}

export default IndexPage

