import React, { useContext } from 'react'

// import GameSetup from "../../components/GameSetup"
// import GameFinale from "../../components/GameFinale"
// import GameMain from "../../components/GameMain"
// import useGameContext from "../../hooks/useGameContext"
// import { StaticVarsProvider } from '../../contexts/staticVarsContext'

const GameElements = () => {

    // const { page } = useGameContext()
    
    const display = {
        // 0: <StaticVarsProvider><GameSetup /></StaticVarsProvider>,
        // 1: <GameMain />,
        // 2: <GameFinale />
    }

    return (
        <div className="elements-container form-inputs flex-col">
            <div className="game-container container p-3 border-start border-end border-5 border-black">
                <div className="game-cols-container col col-md-auto">
                    bruh
                    {/* {display[0]} */}
                </div>
            </div>
        </div>
    )
}

export default GameElements