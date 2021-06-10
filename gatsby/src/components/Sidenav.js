import React from "react"
import {Link} from "gatsby"
import Graph from "react-graph-vis";
import {navigate} from 'gatsby'; //import navigate from gatsby
import { render } from "react-dom";




class SideNav extends React.Component {
    render(){
            return(
            <nav className={`mx-8 top-0 z-40 lg:mx-32 static ${this.props.sideNavheight} rounded-lg bg-gradient-to-t opacity-80 from-black to-white bg-opacity-20`}>
                    <Link to="/"  className="sidenav-links" activeClassName="active">Homeasfdsfdsfdsf </Link> 
                    <Link to="/about" className="sidenav-links" activeClassName="active">About </Link>
            </nav>
        )
    }
}

export default SideNav