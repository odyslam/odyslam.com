// import * as DesignSystem from "./design-system.js"
import React from "react"
import CTA from "../components/CTA.js"
import { MDXProvider } from "@mdx-js/react"
import Layout from '../components/Layout.js'
import { preToCodeBlock } from "mdx-utils"
import Code from '../components/CodeBlock.js'
import Beware from '../components/Beware.js'
// import * from './design-system.js'

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

export default ({ children }) => {

  return (
    <Layout>
        <MDXProvider components={components}>
            {children}
          </MDXProvider>
    </Layout>
  )
}
