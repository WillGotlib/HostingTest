import { createContext, useState } from 'react'
import React from 'react'

import axios from 'axios'

const base_url = "https://www.willgotlib.com/api" // FOR NOW!!!! WILL CHANGE!!!

const StaticVarsContext = createContext({})

export const StaticVarsProvider = ({ children }) => {

    const [schemesList, setSchemesList] = useState([])
    const [scoreSchemes, setScoreSchemes] = useState({})
    
    /* ------ "PRIVATE" FUNCTIONS ------ */
    /* Not to be shared with outside components. Including but not limited to all backend calls. */
    
    // fetch: calls backend which sends us back the set up scoring schemes and their descriptions.
    const fetchSchemes = async () => {
        console.log('-'.repeat(50));
        console.log('FETCHING SCORING SCHEMES');
        axios.get(`${base_url}/schemes/`).then(function (response) {
            console.log("Score Fetch - it worked?", response.data)
            setSchemesList(response.data.list)
            setScoreSchemes(response.data.dictionary)
        }).catch(function (response) {
            console.log("FAILURE?", response);
        })
    }

    /* ------ TOOL FUNCTIONS ------ */
    /* These are the ones that get exported to be called by other components. */

    // Trigger Fetch Schemes method. Just here for some encapsulation safety
    const fetchSchemesHelper = () => {
        if (schemesList.length == 0) {
            fetchSchemes()
        }
    }


    /* ---------------------------- */

    return (
        <>
            <StaticVarsContext.Provider value={
                {
                    schemesList,
                    scoreSchemes,
                    fetchSchemesHelper
                }}>
                {children}
            </StaticVarsContext.Provider>
        </>
    )
}

export default StaticVarsContext