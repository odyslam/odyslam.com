import { useStaticQuery, graphql } from "gatsby"

export const useNodeMap = () => {
  const data  = useStaticQuery(graphql`
  {
    allSitePage {
      nodes {
        isCreatedByStatefulCreatePages
        internal {
          content
          description
          ignoreType
          mediaType
        }
        path
      }
    }
  }
  `)
  return data
}