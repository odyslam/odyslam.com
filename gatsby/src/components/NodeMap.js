import React from "react"
import { useNodeMap } from "../hooks/useNodeMap"




export default  () => {
    // nodeMenu.forEach
    let menu = {};
    const data = useNodeMap();
    console.log(data)
    // const mdxPages = data.allMdx.nodes;
    const pages = data.allSitePage.nodes;

    menu.categories = {}
    menu.pages = {}
    // mdxPages.forEach((mdxPage) => {
    //   if(!menu[mdxPage.category]){
    //     menu[mdxPage.category] = []
    //   }
    //   mdxPage.tags.forEach((tag)=>{
    //     if(menu[mdxPage.category].indexOf(tag) === -1){
    //       menu[mdxPage.category].push(tag) 
    //     }
    //   })
    // })
    menu.pages.level0 = []
    console.log(menu)
    pages.forEach((page)=>{
      if(page.isCreatedByStatefulCreatePages){
        menu.pages.level0.push(page)
    }
      else{
        const category = page.context.node.frontmatter.category;
        const tags = page.context.node.frontmatter.tags;
        const title = page.context.node.frontmatter.title;
        console.log(category, tags, title)
        if(tags && category && title){
            tags.forEach((tag)=>{
            console.log(tag)
            if(!menu.categories[category]){
                menu.categories[category] = []
                console.log(menu)

            }
            if(menu.categories[category].indexOf(tag)===-1){
                menu.categories[category][tag] = [] 
                menu.categories[category][tag].push(title)
            }
            else{
                menu.categories[category].tag.push(title)
            }
            })
            const path = page.path
        }
      }

    })
    
    console.log(menu)
    return(<></>)
}