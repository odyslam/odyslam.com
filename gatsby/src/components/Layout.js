import React from "react"
import SEO from "./SEO"
import Particles from "react-tsparticles";
import Sidenav from '../components/Sidenav.js'

const Layout = (props) => {
  return (
    <>
     <Particles
      id="tsparticles"
      // init={this.particlesInit}
      // loaded={this.particlesLoaded}
      className="opacity-80 top-0 bottom-0 left-0 h-full w-full fixed -z-10"
      // height= {pageHeight}
      options={{
        background: {
          color: {
            value: "white",
          },
        },
        fpsLimit: 60,
        // interactivity: {
        //   detectsOn: "window",
        //   events: {
        //     onClick: {
        //       enable: true,
        //       mode: "push",
        //     },
        //     onHover: {
        //       enable: true,
        //       mode: "repulse",
        //     },
        //     resize: true,
        //   },
        //   modes: {
        //     bubble: {
        //       distance: 400,
        //       duration: 2,
        //       opacity: 0.8,
        //       size: 40,
        //     },
        //     push: {
        //       quantity: 4,
        //     },
        //     repulse: {
        //       distance: 200,
        //       duration: 0.4,
        //     },
        //   },
        // },
        particles: {
          color: {
            value: "#000000",
          },
          links: {
            color: "#000000",
            distance: 200,
            enable: true,
            opacity: 0.5,
            width: 2,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: true,
            speed: 0.8,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              value_area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
      }}
      />
      <Sidenav sideNavheight={props.sideNavheight}>
        <main className="items-center justify-center mx-14 lg:mx-32 py-10">
          <div className="text-white bg-black opacity-80 z-10 h-full break-normal p-10 rounded-lg">
              {props.children}
          </div>
        </main>
      </Sidenav>
    </>
  )
}

export default Layout
