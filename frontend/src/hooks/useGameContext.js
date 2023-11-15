import { useContext } from "react"
import gameContext from "../contexts/gameContext"

const useGameContext = () => {
    const context = useContext(gameContext)
    // if `undefined`, throw an error
    if (context === undefined) {
        throw new Error("useGameContext was used outside of its Provider");
    }
    // console.log(context)

  return context;
}

export default useGameContext