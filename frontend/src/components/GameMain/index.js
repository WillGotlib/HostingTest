import React, {useEffect, useState, useContext} from "react";
import useGameContext from "../../hooks/useGameContext";

const GameMain = () => {

    const {
        roundData,
        guessNum,
        feedback,
        message,
        submitted,
        canContinueMain,
        fetchGameHelper,
        handleNumberChange,
        handleGuessSubmit
    } = useGameContext()
    
    // Local States – Things that don't really matter outside management of this particular screen and are just here to help out
    const [currentMovie, setCurrentMovie] = useState({
        id: -1,
        tmdb_id: -1,
        title: "",
        year: -1,
        runtime: -1,
        poster_path: "/"
    })

    /* ------ USEEFFECTS ------ */

    // Cue the game to fetch.
    useEffect(() => {
        console.log(roundData)
        if (roundData && roundData.id < 0) {
            console.log("Fetching game")
            // fetchGameHelper();
        }
    }, [roundData])

    // Update the currentMovie state to match correct one in roundData
    useEffect(() => {
        console.log("Round Data Updated", roundData);
        setCurrentMovie(roundData?.movies?.[guessNum])
    }, [roundData, guessNum])

    // TODO: make it so the runtime-in input turns red when it doesn't like the number you put in (canContinueMain tell us this)
    return (
        roundData.id === -1 ?
        <>
        <div className="row">
            <div className="w-100 text-center pb-2"><h2>Loading...</h2> </div>
        </div>
        </> 
        :
        <>
        <div className="row">
            <div className="w-100 text-center pb-2"><h2>Guess {guessNum + 1} of {roundData?.size}</h2> </div>
        </div>
        <div className="row">
            <div className="col">
                <img src={roundData.movies[guessNum]?.poster_path} className="main-poster mx-auto d-block img-fluid" alt="Movie Poster"/>
            </div>
            <div className="col">
                <div className="row-md-5">
                    <h2 className="movie-title">{roundData.movies[guessNum]?.title}</h2>
                    <div className="movie-year">({roundData.movies[guessNum]?.year})</div>
                    <div className="pt-5 rounded">
                        <form onSubmit={handleGuessSubmit}>
                            <label>Guess The Runtime</label>
                            <div className="input-group mb-3">
                                <input type="number" onChange={handleNumberChange} className="runtime-in" aria-label="Runtime in Minutes"/>
                                <span className="input-group-text">m</span>
                            </div>
                            <button type="submit" value="Submit" 
                                    id="submit-button" className="btn btn-primary btn-lg"
                                    disabled={!canContinueMain}>
                                {submitted ? "Next" : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="row-md-1">
                    <h4>{feedback}</h4>
                    <div className="message-guess">{message?.guess}</div>
                    <div className="message-truth">{message?.truth}</div>
                    <div className="message-points">{message?.points}</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default GameMain;