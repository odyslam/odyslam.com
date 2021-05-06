import React from "react"
import {Link} from "gatsby"


export default ({children}) => {
    return(
        <>
        <nav className="md: text-left text-center z-40 md:flex md:flex-col static md:fixed m-2 rounded-lg md:h-full p-5 bg-white bg-opacity-20 md:text-4xl text-xl space-y-8">
                <Link to="/"  className="sidenav-links" activeClassName="active">Home </Link>
                <Link to="/about" className="sidenav-links" activeClassName="active">About </Link>
        </nav>
        {children}
        </>
    )
}