// import { useStaticQuery, graphql } from "gatsby"
// export const useSiteMetadata = () => {
//   const { site } = useStaticQuery(
//     graphql`
//   query PostQuery($slug: String!) {
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       html
//       frontmatter {
//         title
//         featuredImage {
//           childImageSharp {
//             fluid(maxWidth: 800) {
//               ...GatsbyImageSharpFluid
//             }
//           }
//         }
//       }
//     }
// }`)
//   return site.siteMetadata
// }

