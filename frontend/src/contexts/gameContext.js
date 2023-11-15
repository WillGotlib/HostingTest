import { createContext, useState } from 'react'
import React from 'react'
import axios from 'axios'

const GameContext = createContext({})

const base_url = "https://www.willgotlib.com" // FOR NOW!!!! WILL CHANGE!!!

export const GameProvider = ({ children }) => {
    
    const title = {
        0: 'Game Setup',
        1: 'Game Main',
        2: 'Game Finale'
    }

    const [page, setPage] = useState(0)

    const [roundData, setRoundData] = useState({
        id: -1,
        movies: [],
        score_scheme: "STD",
        scores: [],
        size: 5,
    })

    const [guessNum, setGuessNum] = useState(0)

    const [guess, setGuess] = useState(0)
    
    const [feedback, setFeedback] = useState("")
    
    const [message, setMessage] = useState({})

    // Tools for checking if we can go on
    const [submitted, setSubmitted] = useState(false)
    const [canContinueMain, setCanContinueMain] = useState(false) // TODO: FINISH IMPLEMENTATION OF THIS
    
    /* ------ "PRIVATE" FUNCTIONS ------ */
    /* Not to be shared with outside components. Including but not limited to all backend calls. */
    
    // fetchGame: calls backend which generates a random game based on the specifications we give it.
    const fetchGame = async (scheme, size) => {
        console.log('-'.repeat(50));
        console.log('FETCHING A GAME FOR THIS USER');

        axios.post(`${base_url}/generate/`, { scheme: scheme, size: size }).then(function (response) {
            response.data['movies'].forEach((movie) => {
                movie.poster_path = "https://image.tmdb.org/t/p/original" + movie.poster_path;
            })
            console.log("Game fetch - it worked?", response.data)
            setRoundData(response.data)
        }).catch(function (response) {
            console.log("FAILURE?", response);
            // setRoundData({ id: -1, ...roundData }); // Check this is actually valid syntax for what I'm trying to do
        })
    }

    // writeMessage: Sets the 'message' prop to the appropriate message string.
    const writeMessage = (data, cur_list) => {
        let message_temp = {
            guess: "You guessed " + data?.guess + ".", 
            truth: "The real answer was " + data?.runtime + ".",
            points: "You earned " + data?.score + " points"
        }
        console.log("Writing message", message_temp)
        if (guessNum > 0) {
            message_temp['points'] = message_temp['points'] + " for a total of " + 
                cur_list.split(",").reduce((partialSum, a) => partialSum + parseFloat(a), 0) + ".";
        } else { message_temp['points'] += "."}
        setMessage(message_temp)
        return message_temp
    }

    // submitGuess: Sends guess to backend with necessary extra info and receives info back. Appropriately adjust data to fit response.
    const submitGuess = e => {
        const form = new FormData()
        form.append("guess", guess)
        // TODO RE these two lines: there has to be a better way...using the Round Guess objects somehow? Or is that not good encapsulation btwn front/back
        form.append("r_id", roundData.id)
        form.append("m_id", roundData.movies[guessNum].id)
        form.append("index", guessNum)
        axios({
            method:"post",
            url:`${base_url}/guess/`,
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        }).then((response) => {
            console.log("DATA:", response.data)
            let newRoundData = {...roundData }
            let split_list = newRoundData.scores.split(',')
            console.log("CONVERTED LIST: \n", split_list)
            split_list[guessNum] = response.data.score
            split_list = split_list.join()
            console.log("MODIFIED LIST: \n", split_list)
            newRoundData.scores = split_list
            setRoundData(newRoundData) 
            setFeedback(response.data?.feedback)
            writeMessage(response.data, split_list)
            console.log("Received the feedback")
            if(feedback) {
                console.log("Feedback was positive")
            }
            setSubmitted(true)
        }).catch((response) => {
            console.log("ERROR IN COMMUNICATION WITH BACKEND")
        })
        console.log("We submit now")
    }

    // moveToNext: Move to the next round (i.e. movie) of the game. If that would exceed the round size, cue end of game.
    const moveToNext = e => {
        setSubmitted(false)
        setFeedback("")
        setMessage({})
        // TODO: Is there a more elegant way to do this?
        if (guessNum >= roundData.size - 1) {
            handleGameEnd()
        } else {
            setGuessNum(guessNum + 1)
        }
    }

    // handleGameEnd: Pack it up. Switch us over to the finale "slide" and cue whatever necessary action to end game
    const handleGameEnd = () => {
        console.log("GAME IS OVER")
        setGuess(0)
        setGuessNum(0)
        setPage(Object.keys(title).length - 1) //
    }

    /* ------ TOOL FUNCTIONS ------ */
    /* These are the ones that get exported to be called by other components. */

    // Trigger Fetch Game method. Just here for some encapsulation safety
    const fetchGameHelper = (scheme="", size=5) => {
        fetchGame(scheme, size)
    }

    // Change GUESS prop from input textbox.
    const handleNumberChange = e => {
        e.preventDefault()
        setGuess(e.target.value)
        setCanContinueMain(4 < e.target.value < 200) // TODO: #1 is this syntax correct? #2 these are values from the backend's variables.py. Make less hard-coded!
    }

    // Submit a guess with the content of the input textbox located at the event. 
    // OR, if we've already submitted and we're looking at the score, take us to next movie.
    const handleGuessSubmit = e => {
        e.preventDefault()
        if (!submitted) { submitGuess(e);
        } else { moveToNext(e); }
    }

    const handlePageChange = num => {
        var temp_page = page + num
        if (-1 < temp_page < Object.keys(title).length - 1) {
            setPage(temp_page)
        }
    }

    const handleNewGame = () => {
        setRoundData({
            id: -1,
            movies: [],
            score_scheme: "STD",
            scores: [],
            size: 5,
        })
        setPage(0)
    }


    /* ---------------------------- */

    return (
        <>
            <GameContext.Provider value={
                {
                    // TODO: Check which ones of these can be safely taken out (+ which SHOULD be on principle)
                    page, setPage, 
                    roundData, setRoundData, 
                    guessNum, setGuessNum, 
                    guess, setGuess, 
                    feedback, setFeedback,
                    message, setMessage,
                    submitted, setSubmitted,
                    canContinueMain,
                    fetchGameHelper,
                    handleNumberChange,
                    handleGuessSubmit,
                    handlePageChange,
                    handleNewGame
                }}>
                {children}
            </GameContext.Provider>
        </>
    )
}

export default GameContext