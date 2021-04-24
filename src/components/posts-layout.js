import { MDXProvider } from "@mdx-js/react"
import * as DesignSystem from "./design-system.js"
import { CTA } from "./CTA.js"

export default function Layout({ children }) {
  return (
    <CTA>
    <MDXProvider
      components={{
        // Map HTML element tag to React component
        h1: DesignSystem.H1,
        h2: DesignSystem.H2,
        h3: DesignSystem.H3,
        p: DesignSystem.P, 
        pre: DesignSystem.Pre, 
        code: DesignSystem.Code, 
        img: DesignSystem.Image,
        blockquote: DesignSystem.blockquote
      }}
    >
      {children}
    </MDXProvider>
    </CTA>
  )
}
