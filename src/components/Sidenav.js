import React from "react"
import {Link} from "gatsby"
import Graph from "react-graph-vis";
import {navigate} from 'gatsby'; //import navigate from gatsby
import { render } from "react-dom";
import NodeMap from "./NodeMap"


const options = {
  configure: {
      enabled: false
  },
  physics: false, 
  interaction: {
      dragNodes: false, 
      dragView: false, 
      selectConnectedEdges: false,
      zoomView: false,
      hover: true
  },
  layout: {
    hierarchical: {
        enabled: true, 
        parentCentralization: true,
        levelSeparation: 200
        , 
        sortMethod: 'directed',
        nodeSpacing: 700,
        shakeTowards: 'leaves' //roots
    }
    
  },

  nodes:{
      shape: 'box',
      size: 100,
      labelHighlightBold: true,
      margin: 30,
      font: { 
          multi: 'md',
          face: 'monospace',
          size: 48, 
          color: 'black' },
      // scaling: {
      //     min: 30,
      //     max: 100
      // },
      widthConstraint: 450,
      heightConstraint: 60,
      fixed: {
        x: true,
        y: true
      },
      chosen: {
          node: false,
          label: (values, id, selected, hovering)=> {
              if(selected){
                  navigate(`/${id}`)
              }
              else {
                  values.color = 'red'
              }
          } 
      }
  },
  edges: {
    color: "#000000"
  },
  // height: "100%",
  // width:"100%%"
};

const events = {
  select: function(event) {
    var { nodes, edges } = event;
  }
};

// Have different graph for every tag, every category

const html = '<h3 class="mt-0 tracking-widest text-center text-black" >How to start a Company</h3> \
  <p class="text-black mx-5 font-serif">Exasfakfdj;asdffhs jfls dhajsd fkldsj;flksdjf;s dlkjf sd;lk fjdsd slkjd sahljsh kdghgh fadslkjfg hsdlkj<p> '


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
        edge.leaves.forEach( (leavf)=>{
            edge.from = object.root;
            edge.to = object.leaves.pop();
            edges.push(edge);
        })
    });
    return edges ;
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





let graph = {
  nodes: [
  { id: "", label: "*home*", title: "node 3 tootip text", level: 0, value: 100 },
    { id: "about", label: "*about*", title: "node 1 tootip text", level: 1, value: 80  },
    { id: "blog/categories", label:"*categories*", title: "node 2 tootip text", level: 1, value: 80 },
    { id: "blog/philosophy", label: "philosophy", title: "node 4 tootip text", level: 2, value: 60 },
    { id: "blog/technology", label: "technology", title: "node 5 tootip text", level: 2, value: 60 },
    { id: "blog/2021/how-to-start-a-cloud-country", label: "How to start a Country", level: 3, image: "http://localhost:8000/static/fc2d391cdcf73db4feda5a48569af123/dcb8b/cloud-country.webp", shape: "circularImage",margin: 10, title: htmlTitle(html)   },
    { id: "b", label: "", title: "node 5 tootip text", level: 3, value: 40 },
    { id: "c", label: "asfasdfasdfsdfsdf", title: "node 5 tootip text", level: 3, value: 40 },
    { id: "d", label: "asfdsafadsfdsafasdfsadfsd", title: "node 5 tootip text", level: 3, value: 40 },
    { id: "e", label: "tecasdfasdfdsfdsfhnology", title: "node 5 tootip text", level: 3 }

  ],
  edges: [
    { from: "", to: "blog/categories" },
    { from: "", to: "about" },
    { from: "blog/categories", to: "blog/philosophy" },
    { from: "blog/categories", to: "blog/technology" },
    { from: "blog/technology", to: "blog/2021/how-to-start-a-cloud-country" },
    { from: "blog/technology", to: "b" },
    { from: "blog/technology", to: "c" },
    { from: "blog/technology", to: "d" },
    { from: "blog/technology", to: "e" },
  ]
};

// TODO function that highlights node based on path


class SideNav extends React.Component {
    state = { network: {}, networkVisible: false };
    componentDidMount() {
      window.addEventListener('resize', this.updateDimensions);
      setTimeout(() => {
        this.state.network.fit()
        var d = document.getElementsByClassName("vis-network")[0];
        d.style.visibility = "visible";
       }, 0)
      }
      updateDimensions = () => {
        this.state.network.redraw();
        this.state.network.fit();
      };
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
      }
    render(){
            return(
            <>
            <nav className="mx-8 top-0 z-40 lg:mx-32 static rounded-lg h-96 bg-gradient-to-t opacity-80 from-black to-white bg-opacity-20">
                    {/* <Link to="/"  className="sidenav-links" activeClassName="active">Homeasfdsfdsfdsf </Link> */}
                    {/* <Link to="/about" className="sidenav-links" activeClassName="active">About </Link> */}
                    <Graph 
                        graph={graph}
                        options={options}
                        events={events}
                        getNetwork={network => {
                            this.setState({network});
                            console.log({network});
                            // this.fitNetwork()
                            //  if you want access to vis.js network api you can set the state in a parent component using this property
                        }}
                        />


            </nav>
            {this.props.children}
            </>
        )
    }
}

export default SideNav