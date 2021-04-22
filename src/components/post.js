// import React from "react"
// import { graphql } from "gatsby"
// import Layout from "../components/layout"
// import Img from "gatsby-image"

// export default function BlogPost({ data }) {
//     let post = data.markdownRemark
//     // let frontmatter = post.frontmatter
//     // let html  = post.html
// // const { markdownRemark } = data
// // const { frontmatter, html } = markdownRemark

// let featuredImgFluid = post.frontmatter.featuredImage.childImageSharp.fluid

//   return (
//     <Layout>
//       <div>
//         <h1>{post.frontmatter.title}</h1>
//         <Img fluid={featuredImgFluid} />
//         <div dangerouslySetInnerHTML={{ __html: post.html }} />
//       </div>
//     </Layout>
//   )
// }


// // export const query = graphql`
// //   query PostQuery($slug: String!) {
// //     markdownRemark(fields: { slug: { eq: $slug } }) {
// //       html
// //       frontmatter {
// //         title
// //         featuredImage {
// //           childImageSharp {
// //             fluid(maxWidth: 800) {
// //               ...GatsbyImageSharpFluid
// //             }
// //           }
// //         }
// //       }
// //     }
// //   }
// // `
// // export const pageQuery = graphql`
// //   query($slug: String!) {
// //     markdownRemark(frontmatter: { slug: { eq: $slug } }) {
// //       html
// //       frontmatter {
// //         date(formatString: "MMMM DD, YYYY")
// //         slug
// //         title
// //       }
// //     }
// //   }
