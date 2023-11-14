import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import GameElements from "../../pages/GameElements";

const Layout = () => {

    useEffect(() => {
        get_heights();
    })

    const [mainHeight, setMainHeight] = useState("")

    const get_heights = () => {
        var head_info = document.body.querySelector('header') ? getComputedStyle(document.body.querySelector('header')) : null
        var foot_info = getComputedStyle(document.body.querySelector('footer'))
        setMainHeight("100vh - " + head_info.getPropertyValue('height') + " - " + foot_info.getPropertyValue('height'))
        console.log(mainHeight)
        // document.body.querySelector('main').style.setProperty('min-height', "100vh ")
        // console.log("HEAD INFO IS: ", head_info.getPropertyValue('height'))
        // console.log("FOOT INFO IS: ", foot_info.getPropertyValue('height'))
    }

    useEffect(() => {
        function handleResize() {
            get_heights()
        }
        // Attach the event listener to the window object
        window.addEventListener('resize', () => {
            console.log("Resize triggered")
        });
        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    })
    

    return (
        <>
        <header className="App-header sticky-top py-3 bg-primary text-white border border-black">
            <div className="bg-black d-inline-block px-3 pb-2 pt-1 rounded">
                <h1>Runtime Game</h1>
                <div className="text-center">Alpha 0.1</div>
            </div>
        </header>
        <main className="page-container" style={{height: 'calc(' + mainHeight + ')'}}>
            <Outlet/>
        </main>
        <footer className="text-center">Made by Will</footer>
        </>
    )

}

export default Layout;