const htmlTitle = (html) => {
    const container = document.createElement("div");
    container.innerHTML = html;
    return container;
  
  }
  
  let topLevel = [
      {
          "root": "blog", 
          "leaves": ["categories"]
      }, 
      {
          "root": "home",
          "leaves": ["categories", "about"]
      }
  ]
  
  let categoriesToTags = [
    {
    "root": "technology",
    "leaves": [
        "blockchain", 
        "react", 
        "solidity", 
      ]
    } 
  ]
    
  
  let tagsToPages = [
      {
          "root": "blockchain",
          "leaves": ["/blog/2021/how-to-start-a-cloud-country/"]
      }, 
      {
          "root": "futurism", 
          "leaves": ["/blog/2021/how-to-start-a-cloud-country/"]
      }
  ]
  
  const posts = {"/blog/2021/how-to-start-a-cloud-country/": 
    {
      title: "How to start a cloud country", 
      excerpt: "blah blah blah blah", 
      coverImageSrc: "http://localhost:8000/static/fc2d391cdcf73db4feda5a48569af123/dcb8b/cloud-country.webp"
    },
  }
  
  function createEdges(nodes){
      let edges = [];
      console.log(nodes)
      nodes.forEach((object)=>{
          let edge = {};
          object.leaves.forEach( (leaf)=>{
              edge.from = object.root;
              edge.to = leaf;
              edges.push(edge);
          })
      });
      return edges
  }
  // nodeRaw = {path, title, coverImage, excerpt}
  
  function createNodes(nodesRaw, level){
      let nodes = [];
      nodesRaw.forEach((nodeRaw)=> {
          let node = {};
          nodes.id = nodeRaw.path
          // node.label = `*${}`
          node.title = htmlTitle(nodeRaw.pageTitle, nodeRaw.pageExcerpt)
          node.level = level
          node.image = nodeRaw.coverImage.Src
          node.shape = 'circularImage'
          nodes.push(node);
      })
      return nodes
  }

  console.log(createEdges(tagsToPages))