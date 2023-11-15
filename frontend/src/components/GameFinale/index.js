import React, {useEffect, useState} from "react";
import useGameContext from "../../hooks/useGameContext";

import ScoreGraph from "../ScoreGraph";

const GameFinale = () => {

    const {
        roundData, setRoundData,
        handleNewGame
    } = useGameContext()

    
    // Data to be fed to recharts graph in the ScoreGraph component
    const [scoreData, setScoreData] = useState([])
    
    // const [roundData, setRoundData] = useState({})
    const test_format = () => {
        if (roundData.size !== undefined) {
            console.log("Filled already")
            return
        }
        console.log("Loaded in End Screen")
        let newRoundData = {...roundData}
        newRoundData.id = 500
        newRoundData.movies = [
            { 
                backdrop_path: "/yeQGyB8MjpX8KR7rUrP0E3gaviC.jpg", 
                id: 43,
                poster_path: "https://image.tmdb.org/t/p/original/1wZUB08igw8iLUgF1r4T6aJD65b.jpg",
                runtime: 134,
                title: "All Quiet on the Western Front",
                tmdb_id: 143,
                year: "1930"
            }, 
            { 
                backdrop_path: "/8lBcqakI3F19NWkXdqE0M8W76b9.jpg", 
                id: 42,
                poster_path: "https://image.tmdb.org/t/p/original/or1gBugydmjToAEq7OZY0owwFk.jpg",
                runtime: 177,
                title: "Braveheart",
                tmdb_id: 17,
                year: "1995"
            }
        ]
        newRoundData.scheme="SND"
        newRoundData.size=2
        newRoundData.scores = '4.5,9.1'
        console.log("Test Data: ", newRoundData)
        // setRoundData(newRoundData)
        console.log("RoundData: ", roundData.scores)
    }

    useEffect(() => {
        test_format()
        var tempData = []

        var scores = roundData?.scores.split(',')
        for (let i = 0; i < scores.length; i++) {
            let movie_title = roundData['movies'][i]['title']
            let score = scores[i]
            tempData.push({"name": movie_title, "score": scores[i]})
        }
        console.log(tempData)
        setScoreData(tempData)
    }, [roundData])

    return (
        <>
        <div className="row">
            <div className="w-100 text-center pb-2"><h3>Game Complete!</h3> </div>
            <div className="p-5">
                You scored a total of <span><h3>{roundData?.scores.split(',').reduce((partialSum, a) => partialSum + parseFloat(a), 0)}</h3></span> points, of a total of {roundData.size * 10} available points.
            </div>
        </div>
        <div className="row text-center pb-2">
            <ScoreGraph data={scoreData}/>
        </div>
        <div className="row text-center pb-2">
            <input type="button" className="btn btn-primary" onClick={handleNewGame} value="New Game"/>
        </div>
        </>
    )
}

export default GameFinale