// import * as DesignSystem from "./design-system.js"
import React from "react"
import CTA from "./CTA.js"
import { MDXProvider } from "@mdx-js/react"
import Layout from './Layout.js'
import { preToCodeBlock } from "mdx-utils"
import Code from './CodeBlock.js'
import Beware from './Beware.js'
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
      <CTA>
        <MDXProvider components={components}>
            {children}
          </MDXProvider>
      </CTA>
    </Layout>
  )
}
