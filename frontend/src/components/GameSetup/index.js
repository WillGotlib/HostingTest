import React, {useContext, useEffect, useState} from "react";
import useGameContext from "../../hooks/useGameContext";
import GameContext from "../../contexts/gameContext";
import useStaticVarsContext from "../../hooks/useStaticVarsContext";

const GameSetup = () => {
    const {
        handlePageChange,
        fetchGameHelper
    } = useGameContext()

    const {
        scoreSchemes,
        schemesList,
        fetchSchemesHelper
    } = useStaticVarsContext()

    const [selectedScheme, setSelectedScheme] = useState("")
    const [currentDesc, setCurrentDesc] = useState("Description")

    const handleGameStart = e => {
        e.preventDefault()
        console.log("Switching to main game.")
        console.log("Fetch game helper", fetchGameHelper)
        fetchGameHelper(selectedScheme, e.currentTarget.elements.size.value)
        handlePageChange(1)
    }

    const handleSchemeChange = e => {
        e.preventDefault()
        console.log("Scheme", e.target.value)
        setSelectedScheme(e.target.value)
        setCurrentDesc(scoreSchemes[e.target.value].description)
    }

    useEffect(() => {
        console.log("Setup UseEffect Triggered")
        if (!selectedScheme) { setSelectedScheme(schemesList[0]) }
        setCurrentDesc(scoreSchemes[selectedScheme]?.description ?? "Not working")
        // setCurrentDesc(scoreSchemes[e.target.value].description)
        fetchSchemesHelper()
    }, [selectedScheme, scoreSchemes, fetchSchemesHelper, schemesList])

    return (
        <>
        <div className="row">
        <form onSubmit={handleGameStart}>
            <div className="w-100 text-center"><h2>Start Game</h2></div>
            <div className="d-flex justify-content-center pb-3">
                <label className="px-3">Game Size</label>
                <input type="number" className="runtime-in px-3" id="size"></input>
            </div>
        <div className="score-sys-container">
            <div id="score-sys-title" className="w-100 text-center p-2 score-sys-boxes">
                Scoring System
            </div>
            <div className="schemesRadio">
            { schemesList && schemesList.map((scheme) => {
                console.log()
                return <label className="flex-fill">
                    <input type="radio" name="radio" key={scheme} defaultChecked={scheme === "SND"} onChange={() => setSelectedScheme(scheme)}/> 
                    <span key={scheme + '_name'} className="flex-fill">{scoreSchemes[scheme]['name']}</span>
                </label>
            })}
            </div>
            <div id="score-sys-desc" className="w-100 text-center p-2 score-sys-boxes">
                {currentDesc}
            </div>
        </div>
            <button className="w-100 mt-3" type="submit">
                Start
            </button>
        </form>
        </div>
        </>
    )
}

export default GameSetup