import React, { FC, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie/es6'
import { BACKEND_URL } from '../App'

interface Props {
    initSettings: string[]
    cookies: Cookies
    setIsAuthenticated: Function
}

// Capitilize the first letter of each word in a string
const capitilize = (s: string) => {
    const arr = s.split(' ')
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }

    return arr.join(' ')
}

const Navbar: FC<Props> = ({ initSettings, cookies, setIsAuthenticated }) => {
    // State
    const settings = useState(initSettings)[0]
    const [dropdown, setDropdown] = useState(false)
    const [isLoggedOut, setIsLoggedOut] = useState(false)

    const onSettingsClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDropdown(!dropdown);
    }

    const endTurnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('end turn')
    }

    const isResponseOk = (response: any) => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json()
        } else {
            throw Error(response.statusText)
        }
    }

    const onLogoutSubmit = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        fetch(BACKEND_URL + '/api-auth/logout/', {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
            },
            credentials: 'same-origin',
        })
        .then(res => isResponseOk(res))
        .then(data => {
            console.log(data)  // -2
            setIsAuthenticated(false)
            setIsLoggedOut(true)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <ul id="navbar" className="top-0 m-0 p-0 pr-2 list-none overflow-hidden bg-blue md:pr-12">
            <li className="inline float-left">
                <img src={process.env.PUBLIC_URL + '/static/massilia-icon.webp'} alt="massilia logo" className="inline-block" /><span className="text-xl text-silver font-bold">MassaliaRP</span>
            </li>
            <li className="inline float-right mx-1.5 md:mx-4">
                <button id="end-turn-btn" className="p-1.5 border-2 border-silver rounded text-lg text-silver font-bold hover:opacity-60" onClick={(e) => {endTurnClick(e)}}>End Turn</button>
            </li>
            <li className="inline float-right mx-1.5 md:mx-10">
                <div className="flex flex-col justify-end items-center mt-4 cursor-pointer hover:opacity-40" onClick={(e) => {onSettingsClick(e)}}>
                    <img id="settings-icon" src={process.env.PUBLIC_URL + '/static/settings-icon.png'} alt="settings icon" />
                    <span id="settings-clickable" className="m-0 p-0 text-2xl font-bold">&#8249;</span>
                </div>
                { dropdown && 
                    <div id="settings-dropdown">
                        {settings.map((i) => (
                            <>
                                <Link key={i} to={'/' + i} className="text-blue font-semibold hover:text-salmon-dark">{capitilize(i)}</Link><br />
                            </>
                        ))}
                        <Link key={'logout'} to="/" className="text-blue font-semibold hover:text-salmon-dark" onClick={(e) => {onLogoutSubmit(e)}}>Logout</Link>
                        { isLoggedOut && <Redirect to="/" /> }
                    </div>
                }
            </li>
        </ul>
    )
}

export default Navbar
