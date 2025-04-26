import React from 'react'
import './leaderboard.css'
import Profiles from './Profiles'
export default function leaderboard(){

    const handleClick = () => {
        console.log(e.target)
    }

    return(
        <div className = "board">
            <h1 className = 'leaderboard'>Leaderboard</h1>
            <div className="duration">
                <button onClick={(handleClick)}></button>
                <button onClick={(handleClick)}></button>
                <button onClick={(handleClick)}></button>
            </div>
            PROFILES
        </div>
    )
}