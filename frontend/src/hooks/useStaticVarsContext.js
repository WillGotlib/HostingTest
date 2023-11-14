import { useContext } from "react"
import staticVarsContext from "../contexts/staticVarsContext"

const useStaticVarsContext = () => {
    const context = useContext(staticVarsContext)
    // if `undefined`, throw an error
    if (context === undefined) {
        throw new Error("useGameContext was used outside of its Provider");
    }
    console.log(context)

  return context;
}

export default useStaticVarsContext